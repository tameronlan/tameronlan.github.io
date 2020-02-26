<template>
    <div class="card-info">
        <div class="card-info__name-wrap ignore-form">
            <div class="ellipsis">
                <span v-if="card.is_online" class="online-status"></span>{{card.name}}
            </div>
            <div class="card-info__age" v-if="card.age">, {{card.age}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CardInfo',
        props: ['card']
    }
</script>
