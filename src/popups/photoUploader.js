import {photoUpload} from '../api/profile';

export default {
    uploadPhoto(fileInput, isAvatar = false) {
        return new Promise((resolve, reject) => {
            if (!fileInput.files.length) {
                reject();
            }

            const data = new FormData();
            data.append('file', fileInput.files[0]);
            data.append('is_avatar', isAvatar);

            photoUpload(data).then(response => {
                resolve(response);
            });
        });
    }
}
