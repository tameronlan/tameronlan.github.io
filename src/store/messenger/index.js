import messenger from '../../messenger/';
import Vue from 'vue';

const DIALOG_STATUS_MINE_ONLY = 1;
const DIALOG_STATUS_DEFAULT = 3;
const DIALOG_STATUS_MAYBE_MINE_ONLY = 5;

export default {
    namespaced: true,
    state: {
        contacts: [],
        contactsOffset: 0,
        contactsLimit: 20,
        contactsExtraParams: {},
        contactsIsLoading: false,
        contactsHasNext: true,

        openedContact: null,
        openedContactAllowedToCorrespond: true,

        messages: [],
        messagesLimit: 20,
        messagesHasPrev: true,
        messagesIsLoading: false,
        messageIsSending: false
    },
    getters: {
        contactsRequestParams(state) {
            return {
                offset: state.contactsOffset,
                limit: state.contactsLimit,
                ...state.contactsExtraParams
            };
        },
        messagesRequestParams(state) {
            const params = {
                limit: state.messagesLimit,
                contactId: state.openedContact.id
            };

            if (state.messages.length) {
                params.before_time_id = state.messages[0].id;
            } else {
                params.offset = 0;
            }

            return params;
        },
        getContactById: state => id => {
            for (let i = 0; i < state.contacts.length; i++) {
                if (parseInt(state.contacts[i].id) === id) {
                    return state.contacts[i];
                }
            }
        }
    },
    mutations: {
        addNewContact(state, contact) {
            state.contacts = [contact, ...state.contacts];
        },
        cleanMessages(state) {
            state.messages = [];
            state.messagesOffset = 0;
            state.messagesIsLoading = false;
            state.messageIsSending = false;
            state.messagesHasPrev = true;
            state.openedContactAllowedToCorrespond = true;
        },
        readMineMessages(state, contactId) {
            if (state.openedContact && contactId === state.openedContact.id) {
                state.openedContact.unread = false;
            }

            for (let existed of state.contacts) {
                if (existed.id == contactId) {
                    existed.unread = false;
                }
            }
        },
        resetNewCounter(state, contactId) {
            if (state.openedContact && contactId === state.openedContact.id) {
                state.openedContact['new'] = 0;
            }

            for (let i = 0; i < state.contacts.length; i++) {
                if (state.contacts[i].id === contactId) {
                    Vue.set(state.contacts[i], 'new', 0);
                    break;
                }
            }
        },
    },
    actions: {
        loadContactsBatch(ctx) {
            if (!ctx.state.contactsHasNext) {
                return;
            }

            ctx.state.contactsIsLoading = true;

            return messenger.dataSource.getContacts(ctx.getters.contactsRequestParams)
                .then(response => {
                    ctx.state.contacts.push(...response.contacts);
                    ctx.state.contactsIsLoading = false;
                    ctx.state.contactsOffset += ctx.state.contactsLimit;
                    ctx.state.contactsHasNext = response.hasNext;
                });
        },
        loadContactsWithNewExtraParams(ctx, payload) {
            ctx.state.contactsExtraParams = payload;
            ctx.state.contacts = [];
            ctx.state.contactsHasNext = true;
            ctx.state.contactsOffset = 0;
            
            return ctx.dispatch('loadContactsBatch');
        },
        loadMessagesBatch(ctx) {
            if (!ctx.state.messagesHasPrev) {
                return;
            }

            ctx.state.messagesIsLoading = true;

            return messenger.dataSource.getMessages(ctx.state.openedContact, ctx.getters.messagesRequestParams)
                .then(response => {
                    ctx.state.messages.unshift(...response.messages);
                    ctx.state.messagesIsLoading = false;
                    ctx.state.messagesHasPrev = response.hasPrev;
                });
        },
        addNewMessage(ctx, {contactId, message}) {
            let contact;

            for (let i = 0; i < ctx.state.contacts.length; i++) {
                if (parseInt(ctx.state.contacts[i].id) === contactId) {
                    contact = ctx.state.contacts[i];

                    ctx.state.contacts.splice(i, 1);

                    break;
                }
            }

            contact.lastmess = message;

            if (message.author_id === contactId) {
                let prevValue = contact.new;

                Vue.set(contact, 'new', prevValue + 1);
            }

            if (message.author_id === messenger.userId && ctx.state.openedContact) {
                ctx.state.openedContact.has_my_messages = true;
            }

            ctx.state.contacts = [contact, ...ctx.state.contacts];

            if (ctx.state.openedContact && parseInt(ctx.state.openedContact.id) === contactId) {
                ctx.state.messages.push(message);
                ctx.state.openedContact.lastmess = message;
                ctx.state.openedContact.unread = message.author_id !== contactId;

                if (message.author_id === contactId) {
                    ctx.dispatch('markReaded', contactId);
                }
            }
        },
        postMessage(ctx, params) {
            return messenger.dataSource.postMessage({
                contactId: ctx.state.openedContact.id,
                ...params
            });
        },
        openContact(ctx, contact) {
            ctx.commit('cleanMessages');
            ctx.state.openedContact = contact;
        },
        closeContact(ctx) {
            ctx.commit('cleanMessages');
            ctx.state.openedContact = null;
        },
        markReaded(ctx, contactId) {
            return messenger.dataSource.markReaded(contactId).then(() => {
                ctx.commit('resetNewCounter', contactId);
            });
        },
        removeContact(ctx, contactId) {
            return messenger.dataSource.removeContact(contactId).then(() => {
                if (ctx.state.openedContact && contactId === ctx.state.openedContact.id) {
                    ctx.dispatch('closeContact');
                }

                for (let i = 0; i < ctx.state.contacts.length; i++) {
                    if (ctx.state.contacts[i].id === contactId) {
                        ctx.state.contacts.splice(i, 1);
                        break;
                    }
                    ctx.state.contacts = [...ctx.state.contacts];
                }
            });
        }
    }
};
