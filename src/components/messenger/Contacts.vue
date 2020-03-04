<template>
    <div class="messenger-contacts-wrapper" ref="scrollWrapper">
        <div v-if="isEmpty" class="messenger-contacts-empty">
            <div class="messenger-contacts-empty__decor"></div>
            <div class="messenger-contacts-empty__title">
                Еще ни с кем не общались?
            </div>
            <div class="messenger-contacts-empty__desc">
                Листайте карточки, чтобы найти собеседника
            </div>
            <div class="messenger-contacts-empty__btn btn btn_orange ripple ripple_white">
                Листать карточки
            </div>
        </div>
        <contact
                v-else
                v-for="contact in contacts"
                :key="contact.id"
                :contact="contact"
                @click="$emit('select', contact)"/>

        <contacts-loader v-if="isLoading"/>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import Contact from './Contact';
    import ContactsLoader from './ContactsLoader';

    export default {
        components: {ContactsLoader, Contact},
        props: ['settings'],
        data() {
            return {
                contactsList: []
            };
        },
        computed: {
            ...mapState('messenger', {
                contacts: state => state.contacts,
                isLoading: state => state.contactsIsLoading,
                hasNext: state => state.contactsHasNext
            }),
            isEmpty() {
                return false;
            }
        },
        watch: {

        },
        created(){
            this.loadContactsBatch();
        },
        mounted() {
            this.$refs.scrollWrapper.addEventListener('scroll', this.onScroll);
        },
        methods: {
            ...mapActions('messenger', ['loadContactsBatch', 'loadContactsWithNewExtraParams']),
            onScroll() {
                if (!this.hasNext || this.isLoading) {
                    return;
                }

                const wrapperHeight = this.$refs.scrollWrapper.clientHeight;
                const scrollHeight = this.$refs.scrollWrapper.scrollHeight;
                const scrollValue = this.$refs.scrollWrapper.scrollTop;

                if (scrollHeight - wrapperHeight - scrollValue < 20) {
                    this.loadContactsBatch();
                }
            }
        }
    };
</script>
