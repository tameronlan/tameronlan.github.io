import bridge from '@/bridge';

export default {
    getCurrentPosition(useNative = true) {
        return new Promise((resolve, reject) => {
            if (useNative && bridge.isSupported()) {
                bridge.invokeNative('get_location', {}, (obj) => {
                    if(obj.coordinates) {
                        resolve({latitude: obj.coordinates.lat, longitude: obj.coordinates.lon});
                    } else {
                        reject({message: 'failed to get position'});
                    }
                });
            } else if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => resolve({latitude: position.coords.latitude, longitude: position.coords.longitude}),
                    error => reject(error)
                );
            } else {
                return reject({message: 'geolocation not supported'});
            }
        });
    }
}
