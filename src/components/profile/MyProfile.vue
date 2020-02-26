<template>
    <div class="extend">
        <div class="my-profile">
            <div class="my-profile__top">
                <div class="my-profile__settings ripple ripple_white" @click="settings" v-touch>
                    <div class="ico ico_setting"></div>
                </div>

                <my-profile-avatar />
            </div>

            <div class="my-profile__middle">
                <my-profile-views v-if="false"/>
                <my-profile-vip v-else/>

                <div class="my-profile__divider"></div>
            </div>

            <div class="user-profile-info user-profile-info_base">
                <div class="user-profile-info__header">
                    <div class="user-profile-info__title ellipsis">
                        <span class="online-status"></span>Name, 32
                    </div>
                    <div class="user-profile-info__change ripple_lightblue ripple" v-touch @click="editField(age)">change</div>
                </div>
                <div class="user-profile-info__content user-profile-info__content_location">
                    <div class="ico ico_location"></div>Moscow
                </div>
            </div>

            <div class="user-profile-info user-profile-info_photo">
                <div class="user-profile-info__header">
                    <div class="user-profile-info__title">Photo</div>
                    <div class="user-profile-info__change ripple_lightblue ripple" v-touch>add</div>
                </div>
                <div class="user-profile-info__content">
                    <div class="my-profile__photos">
                        <div class="my-profile__photo my-profile__photo_add ripple ripple_white" v-touch>
                            <div class="ico-native ico-native_plus"></div>
                            Добавить
                        </div>
                        <div @click="openPhoto" class="my-profile__photo" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150')"></div>
                        <div @click="openPhoto" class="my-profile__photo" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=2a81d92675aa40ca17cc84259845ba60&n=33&w=221&h=150')"></div>
                        <div @click="openPhoto" class="my-profile__photo" style="background-image: url('https://im0-tub-ru.yandex.net/i?id=8d3bd36b42c2b190ed9f8030f1dd88e5&n=33&w=252&h=150')"></div>
                    </div>
                </div>
            </div>

            <div class="user-profile-info">
                <div class="user-profile-info__header">
                    <div class="user-profile-info__title">Title</div>
                    <div class="user-profile-info__change ripple_lightblue ripple" v-touch @click="editField(about)">change</div>
                </div>
                <div class="user-profile-info__content">
                    Люблю гулять под луной. Живу с родителями. Я танцую и пою, и себя не узнаю. А еще много чит...
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import feed from '@/feed';
    import MyProfileAvatar from './MyProfileAvatar';
    import MyProfileViews from './MyProfileViews';
    import MyProfileVip from './MyProfileVip';
    import photoviewer from '@/popups/photoviewer';

    export default {
        name: "MyProfile",
        components: {MyProfileAvatar, MyProfileViews, MyProfileVip},
        data() {
            return {
                isLoadingStatus: false,
                hasMainPhoto: false,
                name: {
                    label: 'Name',
                    field: 'name',
                    type: 'input',
                    placeholder: 'Enter'
                },
                age: {
                    label: 'Age',
                    field: 'age',
                    min: 18,
                    max: 99,
                    type: 'number',
                    placeholder: 'Enter'
                },
                about: {
                    label: 'About',
                    field: 'name',
                    type: 'text',
                    placeholder: 'Enter',
                    description: 'description'
                },
                radio: {
                    label: 'Radio',
                    field: 'radio',
                    type: 'radio',
                    options: [
                        {title: "1", value: "1"},
                        {title: "2", value: "2"},
                        {title: "3", value: "4"},
                    ]
                }
            }
        },
        computed: {
            avatarStyles() {
                return this.hasMainPhoto ? {
                    backgroundImage: 'https://avatars.mds.yandex.net/get-pdb/27625/3d12982b-61d2-4458-b5e0-f8cbe4db85cc/s1200'
                } : {}
            },
            uploaderClass(){
                let classes = ['my-profile-avatar__uploader'];

                if (!this.hasMainPhoto){
                    classes.push('my-profile-avatar__uploader_big');
                } else {
                    classes.push('my-profile-avatar__uploader_mini');
                }

                return classes;
            },
            photoUrl() {
                return [];
            },
            isFirstTime() {
                let key = `serious_profile_preq`;
                return !localStorage.getItem(key);
            },
            ...mapState('vip', ['hasVip']),
            ...mapState('feed', ['moderationStatus']),
            ...mapGetters('feed', ['needUploadPhoto', 'hasSupportAnswer'])
        },
        created() {

        },
        mounted() {

        },
        methods: {
            settings() {
                feed.showSettings();
            },
            sliderClick(){
                console.log("premium clicked")
            },
            editField(item){
                let value = '';
                let options = item.options;

                feed.editField({
                    item: item,
                    defaultValue: value,
                    options: options
                });
            },
            openPhoto(){
                let popup;

                this.$nav.pushInstant({
                    activate: animated => {
                        popup = photoviewer.open({
                            fetch: () => {
                                return new Promise(resolve => {
                                    let photos = [
                                        {
                                            id: 1,
                                            url: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                        },
                                        {
                                            id: 2,
                                            url: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                        },
                                        {
                                            id: 3,
                                            url: 'https://im0-tub-ru.yandex.net/i?id=aaa0c700a686125e286e3d2aac86fd91&n=33&w=225&h=150'
                                        }
                                    ];

                                    resolve(photos);
                                });
                            },
                            initialId: 0,
                            urlAlias: "url",
                            editable: true,
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
</script>
