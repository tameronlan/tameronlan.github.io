<template>
    <div class="messenger-contact" :class="classes" @click="$emit('click')">
        <div class="messenger-contact__ava-wrapper">
            <div class="messenger-contact__ava" :style="{ backgroundImage: `url(${avaSrc})` }">
                <div v-if="contact.user.online" class="online-status"></div>
            </div>
        </div>
        <div class="messenger-contact__right-side">
            <div class="messenger-contact__title">
                <div class="messenger-contact__name" v-html="contact.user.name"></div>
                <div v-if="contact.lastmess" class="messenger-contact__date">
                    {{ date }}
                </div>
            </div>

            <contact-message v-if="contact.lastmess" :contact="contact"/>
        </div>
    </div>
</template>

<script>
    import ContactMessage from './ContactMessage';
    import {getSimpleHumanDate} from '@/lib/dateFunctions';

    export default {
        props: ['contact'],
        components: {ContactMessage},
        computed: {
            classes() {
                const classes = [];

                if (this.contact.new > 0) {
                    classes.push('messenger-contact_unread-theirs');
                } else if (this.contact.unread) {
                    classes.push('messenger-contact_unread-mine');
                }

                if (this.contact.user.online) {
                    classes.push('messenger-contact_online');
                }

                return classes;
            },
            avaSrc() {
                return this.contact.user.avatars.s2;
            },
            date() {
                return getSimpleHumanDate(this.contact.lastmess.time * 1000);
            }
        }
    };
</script>
