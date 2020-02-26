<template>
    <div class="cities-popup">
        <input class="cities-popup__input" :placeholder="$t('profile_editor.geo.placeholder')" type="text"
               :value="search"
               @input="search=$event.target.value">
        <div class="cities-popup__list" v-if="items">
            <div class="cities-popup__list-item" v-for="item in items" :key="item.id" @click="selectItem(item)">
                <div class="cities-popup__city-title">{{ item.name }}</div>
                <div class="cities-popup__city-description">
                    <template v-if="item.subdivision">{{item.subdivision}},</template> {{item.country}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getCitiesByName} from '@/api/meeting';
    import Loader from './common/Loader';

    export default {
        name: 'CitiesPopup',
        props: ['detectedCityId', 'onSelect'],
        components: {Loader},
        data() {
            return {
                search: '',
                items: [],
                cachedResults: {},
                isLoading: false
            };
        },
        mounted() {
            this.loadСities();
        },
        methods: {
            loadСities() {
                let searchString = this.search.trim();
                if (this.cachedResults[searchString]) {
                    this.items = this.cachedResults[searchString];
                } else {
                    this.isLoading = true;
                    getCitiesByName({name: searchString, detectedCityId: this.detectedCityId}).then(response => {
                        let items = response.objects;
                        this.items = items;
                        this.cachedResults[searchString] = items;
                        this.isLoading = false;
                    });
                }
            },
            selectItem(item) {
                this.onSelect && this.onSelect(item);
                this.$nav.back();
            }
        },
        watch: {
            search(newValue, oldValue) {
                this.loadСities();
            }
        }
    };
</script>
