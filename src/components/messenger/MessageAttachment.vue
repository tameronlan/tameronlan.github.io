<template>
    <div class="messenger-message__attachment">
        <template v-if="attachment.type === 'photo'">
            <div
                    class="messenger-message__attachment-photo"
                    :style="{ backgroundImage: `url(${attachment.url_min})` }"
                    @click="$emit('click-photo')"
            >
            </div>
        </template>
        <template v-else-if="attachment.type === 'gift'">
            <div class="messenger-message__light"></div>
            <div
                    class="messenger-message__attachment-gift"
                    :style="{ backgroundImage: `url(${attachment.url_min})` }"
            >
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        props: ['attachment']
    };
</script>
