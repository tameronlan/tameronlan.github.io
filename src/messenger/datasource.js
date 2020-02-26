import {getContacts, getContact, getMessages, postMessage, readAll} from '@/api/chat';

export default {
    getContacts(params) {
        return getContacts(params).then(response => {
            return {
                contacts: response.objects,
                hasNext: response.meta.has_next
            }
        });
    },
    getContact(id) {
        return getContact({contactId: id}).then(response => {
            return {
                contact: response.data
            }
        });
    },
    getMessages(contact, params) {
        return getMessages(params).then(response => {
            const result = {
                messages: [],
                hasPrev: false
            };

            result.hasPrev = response.meta.has_next;
            result.messages = response.data.messages;

            if (contact.mutual_ts && !result.hasPrev) {
                result.messages.push(formatMutualMessage(contact));
            }

            result.messages.reverse();

            return result;
        });
    },
    postMessage(params) {
        return postMessage(params);
    },
    markReaded(contactId) {
        return readAll({
            contactId: contactId
        });
    },
    removeContact(contactId) {
        const formData = new FormData();

        formData.append('id', contactId);
        formData.append('clear_history', 1);
        formData.append('action', 2);

        return post('/usercontact_chat/remove_contact/', formData);
    }
};

function formatMutualMessage(contact) {
    const message = {};

    message.id = 'mutual';
    message.mutual_ts = contact.mutual_ts;

    return message;
}
