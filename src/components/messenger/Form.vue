<template>
    <div class="messenger-form">
        <div class="messenger-form__left-side">
            <div class="ico2 ico2_gift-mess" @click="openGiftPopup"></div>
        </div>
        <div class="messenger-form__input-wrapper">
            <div class="messenger-form__hidden-input" ref="hiddenInput" v-html="textHidden"></div>
            <textarea class="messenger-form__input"
                      :value="text"
                      :placeholder="placeholder"
                      @input="text = $event.target.value"
            ></textarea>
        </div>
        <div class="messenger-form__right-side">
            <button class="messenger-form__button" @click="submit">
                <template v-if="isSending">
                    <loader :extra-small="true"/>
                </template>
                <template v-else>
                    <SendIcon v-if="text.trim().length > 0"/>
                    <button v-else class="messenger-form__button messenger-form__attach-photo">
                        <template v-if="photoIsUploading">
                            <loader :extra-small="true"/>
                        </template>
                        <template v-else>
                            <div class="ico2 ico2_photo-messenger"></div>
                            <input type="file" ref="file" @change="onSelectPhoto($event)"/>
                        </template>
                    </button>
                </template>
            </button>
        </div>
    </div>
</template>

<script>
    import CameraIcon from '@/assets/svg/messenger-camera.svg';
    import SendIcon from '@/assets/svg/messenger-send.svg';
    import SendDisabledIcon from '@/assets/svg/messenger-send-disabled.svg';
    import Loader from '@/components/common/Loader';
    import feed from '@/feed';

    export default {
        components: {CameraIcon, SendIcon, SendDisabledIcon, Loader},
        props: ['isSending', 'photoIsUploading', 'placeholder', 'user'],
        data() {
            return {
                text: '',
                textHidden: '',
            }
        },
        methods: {
            submit() {
                if (this.isSending || this.text.trim().length === 0) {
                    return;
                }

                this.$emit('submitMessage', this.text);
            },
            onSelectPhoto() {
                this.$emit('submitFile', this.$refs.file.files[0]);
            },
            openGiftPopup() {
                feed.openSendGift({user: this.user});
            }
        },
        watch: {
            text(val){
                this.textHidden = val.replace(new RegExp('\n', 'g'), '<br/>&nbsp;');
            },
            isSending(newValue) {
                if (!newValue) {
                    this.text = '';
                }
            }
        }
    };
</script>
