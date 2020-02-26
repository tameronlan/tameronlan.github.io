<template>
    <div class="settings">
        <div class="settings__button" @click="$emit('filterMode')">{{$t('setting.filters')}} <i class="ico ico_sort"></i></div>
    </div>
</template>

<script>
    export default {
        name: "Settings"
    }
</script>
