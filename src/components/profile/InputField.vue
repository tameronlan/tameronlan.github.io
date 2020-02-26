<template>
    <div class="input-field">
        <input type="text" class="input-field__input"
               :class="{'input-field__input_invalid': error != null}"
               :placeholder="item.placeholder"
               :value="value"
               @input="$emit('input', $event.target.value)"
        >
        <div v-if="error" class="input-field__error">{{error}}</div>
    </div>
</template>

<script>
    export default {
        name: 'InputField',
        props: ['item', 'value'],
        data() {
            return {
                error: null
            }
        },
        methods: {
            validate(text) {
                if (text.trim().length < 2) {
                    return {isValid: false, error: this.$t('field_editor.name_error_incorrect')}
                }

                if (!/^.{0,50}$/.test(text)) {
                    return {isValid: false, error: this.$t('field_editor.name_error_long')}
                }

                if (!/^((?!http:\/\/|https:\/\/|www\.).)*$/i.test(text)) {
                    return {isValid: false, error: this.$t('field_editor.name_error_link')}
                }

                return {isValid: true, error: null}
            },
            errorHandler(data) {
                this.error = data.message;
            }
        },
        watch: {
            value() {
                let check = this.validate(this.value);
                this.error = check.error;
                this.$emit('validate', check.isValid);
            }
        }
    }
</script>
