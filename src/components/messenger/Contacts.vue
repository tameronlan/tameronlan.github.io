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
                v-for="contact in contactsList"
                :key="contact.id"
                :contact="contact"
                @click="$emit('select', contact)"/>

        <contacts-loader v-if="isLoading"/>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import Suggestions from './Suggestions';
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
        mounted() {
            this.contactsList = [
                {
                    new: 10,
                    user: {
                        id: 1,
                        name: 'Name',
                        online: true,
                        avatars: {
                            s2: '//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13'
                        }
                    },
                    lastmess: {
                        time: 100,
                        text: 'sdasdkajs dhsad hjksajhdsk '
                    },
                },
                {
                    user: {
                        id: 2,
                        name: 'Name 2',
                        online: true,
                        avatars: {
                            s2: '//im0-tub-ru.yandex.net/i?id=ec20567ec262c7f41fe5232f2c538cff&n=13'
                        }
                    },
                    lastmess: {
                        attaches: [
                            {type: 'image'}
                        ],
                        time: 100,
                        text: 'ksdhasjkd jdhadk jahd kjsahdajs dhasdkh sdasdkajs dhsad hjksajhdsk '
                    },
                },
                {
                    user: {
                        id: 3,
                        name: 'Name 3',
                        online: false,
                        avatars: {
                            s2: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                        }
                    },
                    lastmess: {
                        fromId: 111,
                        time: 100,
                        text: 'hi'
                    },
                },
                {
                    new: 3,
                    user: {
                        id: 3,
                        name: 'Name 3',
                        online: false,
                        avatars: {
                            s2: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                        }
                    },
                    lastmess: {
                        fromId: 111,
                        time: 100,
                        text: 'hi'
                    },
                }
            ]
            // this.$refs.scrollWrapper.addEventListener('scroll', this.onScroll);
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
                    // this.loadContactsBatch();
                }
            }
        }
    };
</script>
