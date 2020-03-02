<template>
    <div class="game-popup__top-decoration" :style="{height: `${height}px`}">
        <svg :viewBox="viewBoxString" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path :d="pathString" :fill="fillColor"/>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "game-decor",
        props: ['height', 'width', 'fillColor'],
        computed:{
            viewBoxString(){
                return `0 0 ${this.width} ${this.height}`
            },
            pathString(){
                return `M0,${this.height} C${this.width*0.22},${this.height*0.23} ${this.width*0.77},${this.height*0.23} ${this.width},${this.height}`
            }
        }
    }
</script>