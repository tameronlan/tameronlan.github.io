<template>
    <div class="messenger-message__attachment">
        <div
            class="messenger-message__attachment-photo"
            :style="{ backgroundImage: `url(${attachment.url_min})` }"
            @click="$emit('click-photo')">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['attachment']
    };
</script>