<template>
    <div class="complaint">
        <template v-if="!complaintSent">
            <div class="complaint__black-list">
                <input type="checkbox" name="checkbox-field-group" id="complaint-checkbox" v-model="checked" checked>
                <label for="complaint-checkbox">{{$t('complaint.check')}}</label>
            </div>
            <button class="btn btn_orange ripple ripple_white complaint__send-btn" @click="complaint" v-touch>{{$t('complaint.btn')}}</button>
        </template>
        <template v-else>
            <div class="complaint__title" v-html="$t('complaint.result.title')"></div>
            <div class="complaint__message" v-html="$t('complaint.result.msg')"></div>
        </template>
        <div class="popup__close" @click="$nav.back({ignoreUpdate: true, success: complaintSent})">
            <i class="ico ico_close-gray"></i>
        </div>
    </div>
</template>

<script>
    import {complaint} from "@/api/meeting";

    export default {
        name: "Complaint",
        props: ['user'],
        data() {
            return {
                complaintSent: false,
                checked: true
            }
        },
        methods: {
            complaint() {
                complaint({to_user_id: this.user.id, black_list: this.checked});
                this.complaintSent = true;
            }
        }
    }
</script>
