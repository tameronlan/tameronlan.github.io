import interstitials from './interstitials';
import {PLACEMENT_PROFILE} from "../consts";

let lastTime = null;

const instance = {
    get cooldown() {
        let placement = interstitials.getPlacement(PLACEMENT_PROFILE);
        return placement.options.interval ? placement.options.interval * 1000 : 300000;
    },
    get lastTime() {
        if (lastTime !== null) {
            return lastTime;
        }

        lastTime = parseInt(sessionStorage.getItem('serious_profile_time')) || 0;

        if (!lastTime) {
            lastTime = new Date().getTime() - instance.cooldown - 100;
        }

        return lastTime;
    },
    set lastTime(value) {
        lastTime = value;
        sessionStorage.setItem('serious_profile_time', value);
    },
    shouldPresent() {
        const diff = new Date().getTime() - instance.lastTime;
        return diff > instance.cooldown;
    },
    load() {
        return interstitials.load(PLACEMENT_PROFILE);
    },
    present() {
        return interstitials.present(PLACEMENT_PROFILE).then(() => {
            instance.lastTime = new Date().getTime();
        }).catch(() => {});
    }
};

export default instance;
