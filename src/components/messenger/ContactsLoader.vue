<template>
    <div class="p_m row row_justify-content-center">
        <loader :small="true"/>
    </div>
</template>

<script>
    import Loader from '@/components/common/Loader';

    export default {
        components: { Loader }
    };
</script>
