<template>
    <div class="field-editor">
        <div class="popup__close" @click="$nav.back()">
            <i class="ico ico_close-gray"></i>
        </div>

        <div class="field-editor__header">
            <div class="field-editor__title">{{item.label}}</div>
        </div>

        <div v-if="this.item.description" class="field-editor__description">{{this.item.description}}</div>
        <comment :is="getFieldComponent()" :item="item" :options="options" @validate="onValidate"
                 ref="fieldComponent"
                 v-model="editableValue"></comment>

        <div class="field-editor__actions">
            <button class="field-editor__btn btn btn_turquoise" @click="save" :disabled="!isValid">{{$t('field_editor.action_save')}}</button>
        </div>

        <div v-if="isLoading" class="loader-wrap loader-wrap-inside">
            <loader></loader>
        </div>
    </div>
</template>

<script>
    import TextField from './TextField';
    import RadioField from './RadioField';
    import CheckboxField from './CheckboxField';
    import NumberField from './NumberField';
    import GeoField from './GeoField';
    import InputField from './InputField';
    import Loader from '@/components/common/Loader';
    import {saveField} from '../../api/profile';

    export default {
        name: "FieldEditor",
        components: {Loader},
        props: ['item', 'defaultValue', 'options', 'onUpdate'],
        data() {
            return {
                isLoading: false,
                isValid: true,
                editableValue: null
            }
        },
        created() {
            this.editableValue = this.getFieldValue();
        },
        computed: {},
        methods: {
            save() {
                switch (this.item.type) {
                    case 'geo':
                        if (this.editableValue == this.defaultValue) {
                            this.$nav.back();
                            return;
                        }
                        break;
                }

                this.isLoading = true;

                saveField({
                    field_name: this.item.field,
                    field_value: this.editableValue || ''
                }).then(response => {
                    this.isLoading = false;

                    let userData = response.objects[0].user;
                    this.onUpdate && this.onUpdate(userData);

                    this.$nativeStat.trackAppsFlyerEvent('af_update', {af_content_id: [this.item.field]});

                    this.$nav.back();
                });
            },
            getFieldComponent() {
                switch (this.item.type) {
                    case 'radio':
                        return RadioField;
                    case 'number':
                        return NumberField;
                    case 'checkbox':
                        return CheckboxField;
                    case 'geo':
                        return GeoField;
                    case 'input':
                        return InputField;
                    case 'text':
                    default:
                        return TextField;
                }
            },
            getFieldValue() {
                switch (this.item.type) {
                    case 'radio':
                        return this.defaultValue && this.defaultValue.value;
                    case 'checkbox':
                        return this.defaultValue && this.defaultValue.map(item => item.value);
                    case 'input':
                        return this.defaultValue;
                    case 'text':
                    default:
                        return this.defaultValue;
                }
            },
            onValidate(isValid) {
                this.isValid = isValid;
            },
            getErrorMessage(error) {
                switch (error) {
                    case 'long_name':
                        return this.$t('field_editor.name_error_long');
                    case 'bad_name':
                    default:
                        return this.$t('field_editor.name_invalid');
                }
            }
        }
    }
</script>
