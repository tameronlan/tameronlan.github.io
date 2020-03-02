<template>
    <div v-if="showing"
         class="card-item"
         :class="{'card-item__is-current': isCurrent, 'card-item__animated': interactAnimating}"
         :style="{ transform: transformString }"
         ref="interactElement"
    >
        <div class="card-item__photo"
             :style="{backgroundImage: `url(${photoUrl})`}"
             @click="$emit('clickProfile')"></div>

        <div class="card-item__indicator card-item__indicator_like" :style="indicatorLineStyles.like"></div>
        <div class="card-item__indicator card-item__indicator_dislike" :style="indicatorLineStyles.dislike"></div>

        <div class="card-item__ico card-item__ico_like" :style="isDraggedRight && indicatorStyles"></div>
        <div class="card-item__ico card-item__ico_dislike" :style="isDraggedLeft && indicatorStyles"></div>

        <div class="card-item__extra">
            <card-info :card="card" @click.native="$emit('clickProfile')"/>
        </div>

        <card-actions @like="likeAction" @dislike="dislikeAction" :style="actionStyles"/>
        <div v-if="card.additional_data" class="card-item__additional" v-html="card.additional_data"></div>
    </div>
</template>

<script>
    import interactMixin from '@/mixins/interact';
    import CardInfo from './CardInfo';
    import CardActions from './CardActions';
    import feed from '@/feed/';
    import {mapState, mapGetters, mapMutations} from 'vuex';

    const MAX_DRAG_DISTANCE = 100;

    export default {
        name: "Card",
        mixins: [interactMixin],
        components: {CardInfo, CardActions},
        data() {
            return {
                showing: true,
                interactMaxRotation: 5
            }
        },
        props: ['card', 'isCurrent'],
        computed: {
            photoUrl() {
                return this.card.avatars.s5;
            },
            isDraggedLeft() {
                return !this.interactAnimating && this.interactPosition.x < 0;
            },
            isDraggedRight() {
                return !this.interactAnimating && this.interactPosition.x > 0;
            },
            absoluteDraggedDistance() {
                return Math.abs(this.interactPosition.x);
            },
            indicatorStyles() {
                return {
                    opacity: 1
                }
            },
            indicatorLineStyles() {
                let isDefault = this.isDraggedLeft || this.interactPosition.x === 0;

                return {
                    like: {
                        opacity: isDefault ? 0 : 1
                    },
                    dislike: {
                        opacity: isDefault ? 1 : 0
                    }
                }
            },
            actionStyles() {
                return {
                    opacity: this.interactPosition.x !== 0 ? 0 : 1
                };
            },
            dialogLockedByDailyLimit() {
                if (this.hasVip || this.card.is_open) {
                    return false;
                }

                return !this.canOpenDialog;
            },
            ...mapState('vip', ['hasVip']),
            ...mapState('feed', ['likeActionLocked', 'viewedCardsAfterPhotoRequest']),
            ...mapGetters('feed', ['needUploadPhoto', 'numCardsBeforeRequestPhoto', 'canOpenDialog'])
        },
        mounted() {
            if (this.isCurrent) {
                this.trackViewEvent();
            }
        },
        methods: {
            draggedRight() {
                this.likeAction();
            },
            draggedLeft() {
                this.dislikeAction();
            },
            likeAction() {
                this.playCard();

                this.interactSetPosition({
                    x: this.interactOutOfSightXCoordinate,
                    rotation: this.interactMaxRotation,
                });

                this.$emit('likeAction');

                feed.showGame({
                    card: this.card
                });

                this.hideCard();
            },
            dislikeAction() {
                if (this.likeActionLocked) {
                    this.unlockLikeAction();
                    this.resetPhotoRequestCounter();
                }

                this.playCard();

                this.interactSetPosition({
                    x: -this.interactOutOfSightXCoordinate,
                    rotation: -this.interactMaxRotation,
                });

                this.$emit('dislikeAction');
                this.hideCard();
            },
            playCard() {
                this.interactUnsetElement();
            },
            hideCard() {
                setTimeout(() => {
                    this.showing = false;
                    this.$emit('hideCard', this.card);
                }, 300);
            },
            sendMessage() {
                if (this.dialogLockedByDailyLimit) {
                    feed.showMessageLimit(this.card);
                } else {
                    feed.openChatWithUser(this.card.id);
                }
            },
            trackViewEvent() {

            },
            ...mapMutations('feed', ['lockLikeAction', 'unlockLikeAction', 'resetPhotoRequestCounter'])
        },
        watch: {
            isCurrent(newValue) {
                if (newValue) {
                    // this.trackViewEvent();
                }
            }
        }
    }
</script>
