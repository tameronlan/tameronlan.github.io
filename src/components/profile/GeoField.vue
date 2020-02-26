<template>
    <div class="geo-field">
        <input class="geo-field__input" :placeholder="$t('profile_editor.geo.placeholder')" type="text"
               :value="city && city.name || ''"
               @input="city = $event.target.value"
               @click="showListOfCities()" readonly>
        <div class="geo-field__message" @click="showListOfCities()">{{$t('profile_editor.geo.message')}}</div>
    </div>
</template>

<script>
    import Popup from '@/popups/Popup';
    import CitiesPopup from '@/components/CitiesPopup';

    export default {
        name: "GeoField",
        props: ['item', 'value', 'options'],
        data() {
            return {
                city: null
            }
        },
        created() {
            this.city = this.value;
        },
        methods: {
            showListOfCities() {
                const popup = new Popup({
                    component: CitiesPopup,
                    props: {detectedCityId: this.city && this.city.id || 0, onSelect: this.onSelect},
                    options: {myClass: 'popup_fixed-top'}
                });

                this.$nav.pushInstant({
                    activate: animated => {
                        this.$store.dispatch('popups/openPopup', {popup, animated});
                    },
                    unload: animated => {
                        this.$store.dispatch('popups/closePopup', {popup, animated});
                    }
                });
            },
            onSelect(item) {
                this.city = item;
                this.$emit('input', parseInt(item.id));
            }
        }
    }
</script>
