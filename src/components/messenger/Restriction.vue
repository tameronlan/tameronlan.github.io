<template>
    <div class="messenger-restriction">
        {{ $t(message) }}
    </div>
</template>

<script>
    export default {
        props: ['message'],
    };
</script>