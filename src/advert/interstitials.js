import store from '@/store/';
import bridge from '../bridge';
import Placement from './Placement';
import {CLOSED, FAILED} from "./statuses";

const placements = {};
const instance = {
    init() {
        bridge.registerMethod('ad_status_changed', instance.statusHandler);
    },
    createPlacement({name, options}) {
        if (placements[name]) {
            return false;
        }

        placements[name] = new Placement(name, options);
    },
    load(name) {
        const placement = placements[name];

        if (!placement) {
            return false;
        }

        let country = store.state.config.country || '';
        let params = {
            country: country.toUpperCase(),
            ...placement.options.params
        };

        bridge.invokeNative('load_ad', {place_id: placement.id, params: params});
    },
    present(name) {
        return new Promise((resolve, reject) => {
            const placement = placements[name];

            if (!placement) {
                reject();
                return;
            }

            let statusHandler = ({status}) => {
                if (status == CLOSED || status == FAILED) {
                    placement.off('update_status', statusHandler);
                    resolve();
                }
            };

            placement.on('update_status', statusHandler);

            bridge.invokeNative('intent_ad', {place_id: placement.id});
            bridge.invokeNative('present_ad', {place_id: placement.id, params: placement.options.present_params});
        });
    },
    getPlacement(name) {
        return placements[name];
    },
    statusHandler(params) {
        for (let key in placements) {
            let placement = placements[key];
            if (placement.id == params.place_id) {
                placement.updateStatus(params.status);
                break;
            }
        }
    }
};

export default instance;
