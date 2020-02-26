<template>
    <photo :content="content"></photo>
</template>

<script>
    import Photo from './Photo';

    export default {
        name: 'Slide',
        components: {Photo},
        props: ['content']
    }
</script>
