export default class JSONAPIResponse {
    constructor(data) {
        this.raw = data;
        this._objectsCache = {};
        this.objects = [];
        this.meta = data.meta || {};
        this.links = data.links || {};

        if (Array.isArray(data.data)) {
            for (let objData of data.data) {
                const obj = this._getObject(objData);
                if (obj) {
                    this.objects.push(obj);
                }
            }
        } else if (data.data) {
            const obj = this._getObject(data.data);
            this.objects = [];
            if (obj) {
                this.objects.push(obj);
            }
        }
    }
    _getObject(data) {
        if (!data.type || !data.id) {
            return false;
        }

        if (this._objectsCache[data.type]
            && this._objectsCache[data.type][data.id]
        ) {
            return this._objectsCache[data.type][data.id];
        }

        const obj = {
            id: data.id,
            type: data.type
        };

        if (data.attributes) {
            for (let attrName in data.attributes) {
                obj[attrName] = data.attributes[attrName];
            }
        }

        if (data.relationships && this.raw.included) {
            for (let relationName in data.relationships) {
                const relationship =  data.relationships[relationName].data;

                if (Array.isArray(relationship)) {
                    obj[relationName] = [];

                    for (let relatedObjData of relationship) {
                        for (let includedObjData of this.raw.included) {
                            if (includedObjData.type !== relatedObjData.type
                                || includedObjData.id !== relatedObjData.id
                            ) {
                                continue;
                            }

                            obj[relationName].push(
                                this._getObject(includedObjData)
                            );
                        }
                    }
                } else {
                    for (let includedObjData of this.raw.included) {
                        if (includedObjData.type !== relationship.type
                            || includedObjData.id !== relationship.id
                        ) {
                            continue;
                        }

                        obj[relationName] = this._getObject(includedObjData);
                    }
                }

            }
        }

        if (data.links) {
            obj.links = data.links;
        }

        if (!this._objectsCache[obj.type]) {
            this._objectsCache[obj.type] = {};
        }
        this._objectsCache[obj.type][obj.id] = obj;

        return obj;
    }
}
