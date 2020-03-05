<template>
    <div class="debug">
        <div class="debug__title">
            Debug
        </div>
        <div class="debug__content">
            <div class="debug-item">
                <div class="debug-item__title">Cookie</div>
                <div class="debug-item__content">
                    <table class="cookies-table">
                        <tr>
                            <th>
                                Name
                            </th>
                            <th>
                                Value
                            </th>
                            <th>
                                Actions
                            </th>
                        </tr>
                        <tr class="cookie-item" v-for="(value, label) in cookies" >
                            <td class="cookie-item__label">{{label}}</td>
                            <td class="cookie-item__value">{{value}}</td>
                            <td class="cookie-item__actions">
                                <button class="cookie-item__link" @click="deleteCookie(label)">delete</button>
                            </td>
                        </tr>
                    </table>

                    <div class="cookie__setter">
                        <input type="text" ref="cookieName" placeholder="name">
                        <input type="text" ref="cookieValue" placeholder="value">

                        <button class="btn btn_orange ripple ripple_white" v-touch @click="saveCookie">Save Cookie</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Cookie from 'js-cookie';

    export default {
        name: "debug",
        data(){
            return {
                cookies: {},
            }
        },
        created(){
            this.cookies = Cookie.get();
        },
        methods: {
            saveCookie(){
                let name = this.$refs.cookieName.value;
                let value = this.$refs.cookieValue.value;

                if(name && value){
                    Cookie.set(name, value);

                    this.cookies = Cookie.get();
                }
            },
            deleteCookie(name){
                Cookie.remove(name);

                this.cookies = Cookie.get();
            }
        }
    }
</script>

<style scoped>

</style>