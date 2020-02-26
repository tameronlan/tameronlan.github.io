<template>
    <div class="incoming-item" :class="{'incoming-item_locked': !isOpen}">
        <div class="incoming-item__photo-wrap">
            <div class="incoming-item__photo" :style="{backgroundImage: `url(${photoUrl})`}"></div>
        </div>
        <div v-if="!isOpen" class="incoming-item__lock"><i class="ico ico_lock"></i></div>
        <div v-if="!item.is_read" class="incoming-item__new">{{$t('incoming.new')}}</div>
        <div class="incoming-item__extra">
            <div class="incoming-item__title">
                <div class="incoming-item__name-wrap">
                    <div class="ellipsis">{{userName}}</div>
                    <div class="incoming-item__age" v-if="item.user.age">, {{item.user.age}}</div>
                </div>
                <span v-if="item.user.online" class="online-status"></span>
            </div>
            <div v-if="isOpen" class="incoming-item__actions">
                <template v-if="!isLiked">
                    <div class="incoming-item__action" @click.stop.prevent="dislike">
                        <dislike-icon/>
                    </div>
                    <div class="incoming-item__action-separator"></div>
                </template>
                <div class="incoming-item__action" :class="{'incoming-item__action-liked': isLiked}"
                     @click.stop.prevent="like">
                    <like-icon/>
                </div>
            </div>
        </div>
        <div v-if="isLiked" class="incoming-item__new-couple">
            <div>Новая пара!</div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import LikeIcon from '@/assets/svg/small_like.svg';
    import DislikeIcon from '@/assets/svg/small_dislike.svg';

    export default {
        name: "IncomingItem",
        components: {LikeIcon, DislikeIcon},
        data() {
            return {
                isLiked: false
            }
        },
        props: ['item', 'autoOpen'],
        computed: {
            userName() {
                return this.isOpen ? this.item.user.name : this.item.user.name.substr(0, 1) + '•••';
            },
            photoUrl() {
                return this.item.user.avatars.s4;
            },
            isOpen() {
                if (this.autoOpen && this.item.is_read) {
                    return true;
                }

                return this.hasVip || this.item.open;
            },
            ...mapState('vip', ['hasVip'])
        },
        methods: {
            like() {
                if (this.isLiked) {
                    return;
                }

                this.isLiked = true;
                this.$emit('like');
            },
            dislike() {
                this.$emit('dislike');
            }
        }
    }
</script>
