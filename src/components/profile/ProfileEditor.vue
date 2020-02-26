<template>
    <div class="profile-editor extend">
        <div class="extend-header">
            <div class="extend-header__back" @click="$nav.back()"><i class="ico ico_circle-back"></i></div>
            <div class="extend-header__title">{{$t('profile_editor.title')}}</div>
            <div class="extend-header__actions">
                <button class="btn_link" @click="previewProfile">{{$t('profile_editor.btn_view')}}</button>
            </div>
        </div>
        <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
            <loader></loader>
        </div>
        <div v-else class="extend-content">
            <photo-gallery v-if="gallery" :photos="gallery" @update="onUpdateGallery"></photo-gallery>
            <div class="profile-editor__form">
                <div class="profile-editor__section">
                    <div class="profile-editor__field">
                        <div class="profile-editor__field-label">{{$t('profile_editor.field_name')}}</div>
                        <div class="profile-editor__field-value ellipsis" @click="editField(userName)">
                            {{user.name}} <i class="ico ico_arrow-right"></i>
                        </div>
                    </div>
                    <div class="profile-editor__field">
                        <div class="profile-editor__field-label">{{$t('profile_editor.field_age')}}</div>
                        <div class="profile-editor__field-value">{{user.age}}, {{$t(user.gender === 'w' ?
                            'profile_editor.female' : 'profile_editor.male')}}
                        </div>
                    </div>
                    <div class="profile-editor__field">
                        <div class="profile-editor__field-label">{{aim.label}}</div>
                        <div class="profile-editor__field-value ellipsis" @click="editField(aim)">
                            {{user[aim.field] ? parseFieldValue(aim, user[aim.field]) : labelAdd}}<i
                                class="ico ico_arrow-right"></i>
                        </div>
                    </div>
                </div>
                <div class="profile-editor__section">
                    <div class="profile-editor__section-title">
                        {{$t('profile_editor.section_about')}}
                        <button class="btn_link" @click="editField(about)">{{$t('profile_editor.btn_edit')}}</button>
                    </div>
                    <div v-if="user.about_me" class="profile-editor__about">{{user.about_me}}</div>
                    <div v-else class="profile-editor__about-empty">{{$t('profile_editor.about_description')}}</div>
                    <div v-for="(item, index) in customFields" :key="index" class="profile-editor__field">
                        <div class="profile-editor__field-label">{{item.label}}</div>
                        <div class="profile-editor__field-value ellipsis" @click="editField(item)">
                            {{user[item.field] ? parseFieldValue(item, user[item.field]) : labelAdd}}<i
                                class="ico ico_arrow-right"></i>
                        </div>
                    </div>
                </div>
                <div class="profile-editor__section">
                    <div class="profile-editor__section-title">{{$t('profile_editor.section_location')}}</div>
                    <div class="profile-editor__field">
                        <div class="profile-editor__field-label">{{city.label}}</div>
                        <div class="profile-editor__field-value ellipsis" @click="editField(city)">
                            {{user.city ? user.city.name : labelAdd}}<i class="ico ico_arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import feed from '@/feed';
    import Loader from '@/components/common/Loader';
    import PhotoGallery from './PhotoGallery';
    import {getProfile} from '@/api/profile';

    export default {
        name: "ProfileEditor",
        components: {PhotoGallery, Loader},
        data() {
            return {
                isLoading: false,
                user: {},
                gallery: [],
                fieldValues: {},
                customFields: {},
                aim: {label: this.$t('profile_editor.field_target'), field: 'rel_aim', type: 'checkbox'},
                about: {
                    label: this.$t('profile_editor.section_about'),
                    field: 'about_me',
                    type: 'text',
                    description: this.$t('profile_editor.about_description2'),
                    placeholder: this.$t('profile_editor.about_placeholder')
                },
                userName: {
                    label: this.$t('profile_editor.user_name.label'),
                    field: 'name',
                    type: 'input',
                    placeholder: this.$t('profile_editor.user_name.placeholder')
                },
                city: {label: this.$t('profile_editor.field_city'), field: 'city', type: 'geo'},
                me: this.$store.state.config.user,
            }
        },
        computed: {
            labelAdd() {
                return this.$t('profile_editor.btn_add');
            }
        },
        created() {
            this.isLoading = true;

            getProfile().then(response => {
                let data = response.objects[0];
                this.customFields = data.custom_fields;
                this.fieldValues = data.field_values;
                this.gallery = data.photo || [];
                this.user = data.user;
                this.isLoading = false;
            });
        },
        methods: {
            previewProfile() {
                feed.openProfile({id: this.me.id});
            },
            editField(item) {
                let value = this.user[item.field];
                let options = this.fieldValues[item.field];

                feed.editField({
                    item: item,
                    defaultValue: value,
                    options: options,
                    onUpdate: this.onUpdateUser
                });
            },
            parseFieldValue(field, value) {
                switch (field.type) {
                    case 'radio':
                        return value.title;
                    case 'number':
                        return value + (field.units ? ` ${field.units}` : '');
                    case 'checkbox':
                        return value.map(item => item.title).join(', ');
                    case 'text':
                    default:
                        return value;
                }
            },
            onUpdateUser(user) {
                this.user = user;
                this.$store.state.config.user.name = this.user.name;
            },
            onUpdateGallery(gallery) {
                this.gallery = gallery;
            }
        }
    }
</script>
