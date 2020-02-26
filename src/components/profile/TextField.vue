<template>
    <div class="input-field">
        <textarea class="text-field" type="text"
                  :placeholder="item.placeholder"
                  :value="value"
                  @input="$emit('input', $event.target.value)"
        ></textarea>
    </div>
</template>

<script>
    export default {
        name: "TextField",
        props: ['item', 'value'],
    }
</script>
