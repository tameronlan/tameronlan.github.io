import BufferedDataSource from '../lib/BufferedDataSource';
import {getFeed} from '../api/meeting';
import store from '../store/';

export default class FeedDataSource extends BufferedDataSource {
    constructor(buffer) {
        super(buffer || [], true)
    }

    load(page) {
        return new Promise((resolve, reject) => {
            store.commit('feed/setLoading', true);

            getFeed({include: 'photos,interests', exclude_ids: this.getBufferIds()}).then(response => {
                store.commit('feed/setLoading', false);

                if (response.users && response.users.length > 0) {
                    resolve({
                        buffer: response.users,
                        hasNext: true
                    });
                } else {
                    reject();
                }
            }).catch(reject);
        });
    }

    getBufferIds() {
        return Object.keys(this.previousBufferIds);
    }
}
