<template>
    <div class="messenger-message" :class="classes">
        <div class="messenger-message__ava"></div>
        <div class="messenger-message__bubble-wrapper">
            <div class="messenger-message__bubble">
                <div v-if="attachments && attachments.length" class="messenger-message__attachments">
                    <message-attachment
                            v-for="attachment in attachments"
                            @click-photo="openPhoto(attachment)"
                            :key="attachment.id"
                            :attachment="attachment"/>
                </div>
                <div class="messenger-message__text-wrapper">
                    <span v-if="text" class="messenger-message__text" v-html="text"></span>
                    <span v-if="message.published_at" class="messenger-message__date">{{date}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MessageAttachment from '../../components/messenger/MessageAttachment';
    import {getSimpleHumanDate} from '@/lib/dateFunctions';
    import photoviewer from '@/popups/photoviewer';

    export default {
        name: 'ChatMessage',
        components: {MessageAttachment},
        props: ['message', 'layout-props'],
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
            text() {
                return this.message.message;
            },
            attachments() {
                return this.message.files.map(file => {
                    return {
                        url_min: file.show_url,
                        ...file
                    }
                });
            },
            date() {
                return getSimpleHumanDate(this.message.published_at * 1000);
            }
        },
        methods: {
            openPhoto(attachment) {
                if (attachment.show_url) {
                    let popup;

                    this.$nav.pushInstant({
                        activate: animated => {
                            popup = photoviewer.open({
                                fetch: () => {
                                    return new Promise(resolve => {
                                        resolve([attachment]);
                                    });
                                },
                                urlAlias: 'show_url',
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
    }
</script>
