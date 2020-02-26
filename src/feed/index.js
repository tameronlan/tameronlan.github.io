import store from '../store/';
import vueNav from '@/nav/';
import {feedClick, filterSet, getUser, parseResponse} from '../api/meeting';
import FeedDataSource from './FeedDataSource';
import MainPhoto from '../components/upload/MainPhoto';
import RealPhoto from '../components/upload/RealPhoto';
import SwipeTutor from '../components/feed/SwipeTutor';
import PushPermissions from '../components/feed/PushPermissions';
import MutualSympathy from '../components/sympathy/MutualSympathy';
import LockedUser from '../components/sympathy/LockedUser';
import VipFullOffer from '../components/vip/VipFullOffer';
import ConfirmPopup from '../components/popups/ConfirmPopup';
import MessageLimit from '../components/feed/MessageLimit';
import Chat from '../components/messenger/Chat';
import Complaint from '../components/popups/Complaint';
import StartPromo from '../components/feed/StartPromo';
import PhotoRequest from '../components/upload/PhotoRequest';
import AppSettings from '../components/profile/AppSettings';
import SendGift from '../components/feed/SendGift';
import UserProfile from '../components/profile/UserProfile';
import ProfileEditor from '../components/profile/ProfileEditor';
import FieldEditor from '../components/profile/FieldEditor';
import UploadErrorPopup from '../components/upload/UploadErrorPopup';
import WaitersPopup from '../components/feed/WaitersPopup';
import GetWaiterPopup from '../components/feed/GetWaiterPopup';

import Popup from '../popups/Popup';
import Queue from '@/lib/Queue';
import {CLICK_TYPE_YES, CLICK_TYPE_NO, AVATAR_STATUS_NONE, SOURCE_VIP_DISABLE_ADS, DIRECTION_RIGHT} from '../consts';
import bridge from '../bridge';
import { getVendor } from '@/lib/browser';
import { VENDOR_IOS } from '@/consts';

const vendor = getVendor();

const feed = {
    feedDS: null,
    queue: new Queue(),
    init() {
        this.feedDS = new FeedDataSource([]);
        this.initCards();

        bridge.registerMethod('disableAds', () => {
            this.showVipFullOffer({source: SOURCE_VIP_DISABLE_ADS});
        });
    },
    checkPromo({promo, rating, ask_photo}) {
        if (promo) {
            this.showStartPromo(promo)
        }

        if (ask_photo) {
            this.showPhotoRequest();
        }

        if (rating) {
            this.showAppReview();
        }
    },
    initCards() {
        let numCards = 2;

        while (numCards--) {
            this.getNextCard();
        }
    },
    getNextCard() {
        this.feedDS.getNextItem((data) => {
            if (data.status === 'default') {
                store.commit('feed/addCard', data.item);
            } else if (data.status === 'loading') {
                data.promise.then((item) => {
                    store.commit('feed/addCard', item);
                }).catch(() => {});
            } else {}
        });
    },
    likeAction(card) {
        feedClick({to_user_id: card.id, type: CLICK_TYPE_YES}).then((response) => {
            console.log(`Handler click`);
            // let user = response.objects[0];

            // if (user.is_mutual) {
            //     setTimeout(() => {
            //         this.showMutualSympathy(card);
            //     }, 350);
            // }
        });

        store.commit('feed/incrementViewedCards');

        this.getNextCard();
    },
    dislikeAction(card) {
        feedClick({to_user_id: card.id, type: CLICK_TYPE_NO});

        store.commit('feed/incrementViewedCards');

        this.getNextCard();
    },
    skipAction(card) {
        store.commit('feed/removeCardById', card.id);

        this.getNextCard();
    },
    openPopup(popup, unloadOther = false) {
        return new Promise(resolve => {
            vueNav.nav.pushInstant({
                unloadOther: unloadOther,
                activate: animated => {
                    store.dispatch('popups/openPopup', {popup, animated});
                },
                unload: (animated, options) => {
                    store.dispatch('popups/closePopup', {
                        popup,
                        animated,
                        onClose: resolve(options)
                    });
                }
            });
        });
    },
    showMutualSympathy(user) {
        let popup = new Popup({
            component: MutualSympathy,
            props: {user: user},
            options: {myClass: 'popup_extend'}
        });

        this.openPopup(popup);
    },
    showPhotoUpload(card) {
        let component;
        let options = {};

        switch (store.state.feed.moderationStatus) {
            case AVATAR_STATUS_NONE:
                component = MainPhoto;
                options = {...options, ...{myClass: 'popup_extend'}};

                break;
            default:
                component = RealPhoto;
        }

        let popup = new Popup({component: component, props: {card: card}, options: options});
        this.openPopup(popup);
    },
    showSwipeTutorial(dir, card) {
        let key = `serious_swipe_${dir}`;
        if (!localStorage.getItem(key)) {
            let popupData = {component: SwipeTutor, props: {dir, card}};

            if (dir === DIRECTION_RIGHT && vendor === VENDOR_IOS) {
                popupData.component = PushPermissions;
            }

            let popup = new Popup(popupData);

            setTimeout(() => {
                this.openPopup(popup);
            }, 350);

            localStorage.setItem(key, '1');
        }
    },
    showLockedUser(item) {
        let popup = new Popup({
            component: LockedUser,
            props: {item},
            options: {myClass: 'popup_extend'}
        });

        this.openPopup(popup);
    },
    complain(user) {
        let popup = new Popup({
            component: Complaint,
            props: {user}
        });

        return this.openPopup(popup);
    },
    showStartPromo(promo) {
        let popup = new Popup({
            component: StartPromo,
            props: {promo},
            options: {myClass: 'popup_extend'}
        });
        this.queue.next(next => {
            this.openPopup(popup);
        });
    },
    showAppReview() {
        let popup = new Popup({
            component: Review
        });
        this.queue.next(next => {
            this.openPopup(popup);
        });
    },
    showReviewResult(props) {
        let popup = new Popup({
            component: ReviewResult,
            props: props
        });

        this.openPopup(popup);
    },
    showPhotoRequest() {
        let popup = new Popup({
            component: PhotoRequest,
            options: {myClass: 'popup_extend'}
        });

        this.queue.next(next => {
            this.openPopup(popup).then(next);
        });
    },
    showSettings() {
        let popup = new Popup({
            component: AppSettings,
            options: {myClass: 'popup_extend'}
        });

        this.openPopup(popup);
    },
    openProfile(props, unloadOther = false) {
        let popup = new Popup({
            component: UserProfile,
            props: props,
            options: {myClass: 'popup_extend'}
        });

        this.openPopup(popup, unloadOther);
    },
    openSendGift(props) {
        let popup = new Popup({
            component: SendGift,
            props: props,
            options: {myClass: 'popup_extend'}
        });

        this.openPopup(popup, false);
    },
    editProfile() {
        let popup = new Popup({
            component: ProfileEditor,
            options: {myClass: 'popup_extend'}
        });

        this.openPopup(popup);
    },
    editField(props) {
        let popup = new Popup({
            component: FieldEditor,
            props: props,
            options: {}
        });

        this.openPopup(popup);
    },
    filterBy(params) {
        filterSet(params).then(() => {
            this.resetCards();
        });
    },
    resetCards() {
        store.commit('feed/clear');
        this.feedDS = new FeedDataSource([]);
        this.initCards();
    },
    showVipFullOffer(params = {}) {
        let popup = new Popup({
            component: VipFullOffer,
            props: params,
            options: {myClass: 'popup_extend'}
        });

        return this.openPopup(popup)
            .then((response = {}) => {
                let offer = store.state.vip.purchaseOffer;

                if (offer && offer.is_one_time_offer && !response.success) {
                    return this.showVipFullOffer({
                        source: params.source
                    })
                } else {
                    return response;
                }
            });
    },
    showConfirmPopup(params) {
        let popup = new Popup({
            component: ConfirmPopup,
            props: params
        });

        return this.openPopup(popup);
    },
    showMessageLimit(user) {
        let popup = new Popup({
            component: MessageLimit,
            props: {user},
            options: {myClass: 'popup_extend'}
        });

        this.queue.next(next => {
            this.openPopup(popup).then(next);
        });
    },
    showUploadError() {
        const popup = new Popup({
            component: UploadErrorPopup
        });

        this.openPopup(popup);
    },
    openChatWithUser(id) {
        let popup = new Popup({
            component: Chat,
            props: {id: id},
            options: {
                myClass: 'popup_extend',
                ignoreBottomBanner: true
            }
        });

        this.openPopup(popup);
    },
    showWaiters() {
        let popup = new Popup({
            component: WaitersPopup,
            options: {myClass: 'popup_extend popup_waiters'}
        });

        this.openPopup(popup);
    },
    showGetWaiter() {
        let popup = new Popup({
            component: GetWaiterPopup,
            options: {myClass: 'popup_extend popup_waiter'}
        });

        this.openPopup(popup);
    }
};

export default feed;
