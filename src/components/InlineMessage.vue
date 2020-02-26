<template>
    <div class="inline-message">
        <input class="inline-message__input"
               type="text"
               ref="inputField"
               :value="message"
               @input="message = $event.target.value"
               :placeholder="placeholder"
               @focus="$emit('focus')"
               @blur="$emit('blur')"
               @keyup.enter="submit"
        >
        <i class="ico ico_send" :class="{'inline-message__disabled-send': message.trim().length == 0}"
           @click="submit"></i>
    </div>
</template>

<script>
    export default {
        name: "InlineMessage",
        props: ['placeholder'],
        data() {
            return {
                message: ''
            }
        },
        methods: {
            submit() {
                let msg = this.message.trim();
                if (msg.length > 0) {
                    this.$refs.inputField.blur();
                    this.$emit('submit', msg);
                    this.message = '';
                }
            }
        }
    }
</script>
