<template>
    <div class="popup popup_extend">
        <div class="loader-wrap loader-wrap_white loader-wrap-inside">
            <loader></loader>
        </div>
    </div>
</template>

<script>
    import Loader from '@/components/common/Loader';

    export default {
        name: 'LoaderExtend',
        components: {Loader}
    }
</script>