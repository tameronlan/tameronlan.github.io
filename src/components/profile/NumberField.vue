<template>
    <div class="number-field">
        <smooth-picker
                class="number-field__picker"
                ref="numberPicker"
                :data="values"
                :change="onChange"
        />
        <div v-if="item.units" class="number-field__units">{{item.units}}</div>
    </div>
</template>

<script>
    import {SmoothPicker} from 'vue-smooth-picker';

    export default {
        name: "NumberField",
        components: {SmoothPicker},
        props: ['item', 'value', 'options'],
        data() {
            return {
                values: []
            }
        },
        created() {
            let list = this.createList();
            let currentIndex = list.indexOf(this.value);

            this.values = [{
                    currentIndex: currentIndex,
                    list: list,
                    textAlign: 'center',
                    className: 'item-group'
            }];
        },
        mounted() {
            setTimeout(()=>{
                this.$refs.numberPicker.safeGetGroupRectList();
            }, 400);
        },
        methods: {
            createList() {
                let list = ['---'];
                for (let i = this.item.min; i <= this.item.max; i++) {
                    list.push(i);
                }
                return list;
            },
            onChange(gIndex, iIndex) {
                let value = this.values[0].list[iIndex];
                this.$emit('input', iIndex > 0 ? value : '');
            }
        }
    }
</script>
