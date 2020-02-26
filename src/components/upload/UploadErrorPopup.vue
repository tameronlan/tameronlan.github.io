<template>
    <div class="upload-error-popup">
        <div class="popup__close" @click="$nav.back()">
            <i class="ico ico_cross-gray"></i>
        </div>
        <div class="upload-error-popup__title">{{$t('upload_error.title')}}</div>
        <div class="upload-error-popup__message">{{$t('upload_error.message')}}</div>
    </div>
</template>

<script>
    export default {
        name: 'UploadErrorPopup'
    }
</script>