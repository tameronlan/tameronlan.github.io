<template>
    <div class="messenger-message" :class="classes">
        <div class="messenger-message__ava" :style="{ backgroundImage: `url(${avaSrc})` }" @click="openProfile"></div>
        <div class="messenger-message__bubble-wrapper">
            <div v-if="getAttachInfo" :class="attachClasses">
                <div v-if="attachments && attachments.length" class="messenger-message__attachments">
                    <message-attachment
                            v-for="attachment in attachments"
                            @click-photo="openPhoto(attachment)"
                            :key="attachment.id"
                            :attachment="attachment"/>
                </div>
                <span class="messenger-message__date">{{date}}</span>
            </div>
            <div v-else class="messenger-message__bubble">
                <div class="messenger-message__text-wrapper">
                    <span v-if="text" class="messenger-message__text" v-html="text"></span>
                    <span class="messenger-message__date">{{date}}</span>
                </div>
            </div>
            <div v-if="layoutProps.isLast && layoutProps.isMine && !contact.unread" class="messenger-message__readed">
                Просмотрено
            </div>
        </div>
    </div>
</template>

<script>
    import {getSimpleHumanDate} from "@/lib/dateFunctions";
    import feed from '@/feed';
    import photoviewer from '@/popups/photoviewer';
    import MessageAttachment from './MessageAttachment';

    export default {
        components: {MessageAttachment},
        props: ['contact', 'message', 'layout-props'],
        computed: {
            classes() {
                const classes = [];

                if (this.layoutProps.isMine) {
                    classes.push('messenger-message_mine');
                }

                if (this.layoutProps.isUserFirst) {
                    classes.push('messenger-message_user-first');
                }

                if (this.layoutProps.isUserLast) {
                    classes.push('messenger-message_user-last');
                }

                if (this.layoutProps.isFirst) {
                    classes.push('messenger-message_first');
                }

                if (this.layoutProps.isLast) {
                    classes.push('messenger-message_last');
                }

                return classes;
            },
            attachClasses(){
                const classes = ['messenger-message__bubble'];

                if (this.getAttachInfo.type === 'photo'){
                    classes.push('messenger-message__bubble_photo');
                } else if (this.getAttachInfo.type === 'gift') {
                    classes.push('messenger-message__bubble_gift');
                }

                return classes;
            },
            avaSrc() {
                return this.contact.user.avatars.s1;
            },
            text() {
                return this.message.text;
            },
            attachments() {
                return this.message.attaches;
            },
            date() {
                return getSimpleHumanDate(this.message.time * 1000);
            },
            getAttachInfo(){
                let res = false;

                if (this.message.attaches !== undefined && this.message.attaches.length){
                    this.message.attaches.forEach(attach => {
                        res = attach;
                    })
                }

                return res;
            }
        },
        methods: {
            openProfile() {
                if (!this.contact.can_view_profile) {
                    return;
                }

                feed.openProfile({id: this.contact.id});
            },
            openPhoto(attachment) {
                if (attachment.url_orig) {
                    let popup;

                    this.$nav.pushInstant({
                        activate: animated => {
                            popup = photoviewer.open({
                                fetch: () => {
                                    return new Promise(resolve => {
                                        resolve([attachment]);
                                    });
                                },
                                urlAlias: 'url_orig',
                                animated
                            });
                        },
                        unload: animated => {
                            photoviewer.close(popup, animated);
                        }
                    });
                }
            }
        }
    };
</script>
