<template>
    <div class="checkbox-field">
        <div v-for="(option, index) in options" class="checkbox-field__option">
            <input type="checkbox" name="checkbox-field-group" :id="option.value" :value="option.value" v-model="checked">
            <label :for="option.value">{{option.title}}</label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CheckboxField",
        data() {
            return {
                checked: []
            }
        },
        props: ['item', 'value', 'options'],
        created() {
            this.checked = this.value || [];
        },
        watch: {
            checked(newValue, oldValue) {
                this.$emit('input', this.checked.join(','));
            }
        }
    }
</script>
