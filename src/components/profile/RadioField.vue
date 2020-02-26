<template>
    <div class="radio-field">
        <div v-for="(option, index) in advancedOptions" class="radio-field__option" :class="{'radio-field__option-not-set': option.value === -1}">
            <input type="radio" name="radio-field-group" :id="option.value" :value="option.value" v-model="picked">
            <label :for="option.value">{{option.title}}</label>
        </div>
    </div>
</template>

<script>
    const NOT_SET_OPTION = -1;

    export default {
        name: "RadioField",
        data() {
            return {
                picked: null
            }
        },
        props: ['item', 'value', 'options'],
        created() {
            this.picked = this.value || NOT_SET_OPTION;
        },
        computed: {
            advancedOptions() {
                return [
                    {title: this.$t('field_editor.not_set'), value: NOT_SET_OPTION},
                    ...this.options
                ]
            }
        },
        watch: {
            picked(newValue, oldValue) {
                this.$emit('input', this.picked == NOT_SET_OPTION ? null : this.picked);
            }
        }
    }
</script>
