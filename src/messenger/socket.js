import messenger from '../messenger/';
import store from '@/store';
import datasource from './datasource';
import EventBus from '@/lib/EventBus';

const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

let url;
let socket;

export default {
    init(config) {
        if (config.wsChatUrl === undefined){
            return;
        }

        url = config.wsChatUrl;

        connect();
    },
    checkConnection() {
        if (!socket || socket.readyState === CLOSED) {
            connect();
        }
    }
};

function connect() {
    try {
        socket = new WebSocket(url);

        socket.onopen = () => {

        };

        socket.onclose = () => {

        };

        socket.onerror = (event) => {
            console.log('socket.onerror', event);
        };

        socket.onmessage = onmessage;

        window.ts = socket;
    } catch (e) {
        console.log('Socket connect error', e);
    }
}

function onmessage(event) {
    const data = JSON.parse(event.data);

    switch (data.body.type) {
        case 'newmsg':
            handleNewMessage(data);
            break;
        case 'read':
            handleReadMine(data);
            break;
    }
}

function handleNewMessage(data) {
    let message = data.body.message;

    let newMessage = {
        id: message.time_id,
        author_id: message.from_id,
        time: message.time,
        ...message.data
    };

    let contactId = message.from_id === parseInt(messenger.userId) ? message.to_id : message.from_id;
    let contact = store.getters['messenger/getContactById'](contactId);

    if (contact) {
        store.dispatch('messenger/addNewMessage', {contactId, message: newMessage});
    } else {
        datasource.getContact(contactId).then(response => {
            let contact = response.contact;

            EventBus.$emit('updateCouple', contact);

            let addNewContact = true;

            if (contact.mutual_ts) {
                if (contact.has_my_messages) {
                    EventBus.$emit('removeCouple', contactId);
                } else {
                    addNewContact = false;
                }
            }

            if (addNewContact) {
                store.commit('messenger/addNewContact', contact);
                store.dispatch('messenger/addNewMessage', {contactId, message: newMessage});
            }
        });
    }
}

function handleReadMine(data) {
    const contact = data.body.contact;

    if (contact.contact_id === messenger.userId) {
        store.commit('messenger/readMineMessages', contact.user_id);
    }
}
