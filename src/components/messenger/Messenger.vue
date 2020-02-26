<template>
    <div class="messenger">
        <div class="messenger__top">
            Сообщения <div class="messenger__counter">+1</div>
        </div>

        <contacts @select="openContact($event)"/>
    </div>
</template>

<script>
    import Contacts from '@/components/messenger/Contacts';

    export default {
        components: {
            Contacts
        },
        data() {
            return {
                currentTabId: 0
            };
        },
        computed: {},
        mounted() {},
        methods: {
            openContact(contact) {
                this.$nav.push('/app/messenger/' + contact.user.id);
            }
        }
    };
</script>
