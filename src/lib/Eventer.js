export default class Eventer {
    constructor(parent) {
        this._parent = parent;
        this._handlers = {};
        this._namespaces = {};
    }

    on(event, callback, extra) {
        if (!this._handlers[event]) {
            this._handlers[event] = [];
        }

        var handler = {
            callback: callback,
            ...extra
        };

        this._handlers[event].push(handler);
    }

    one(event, callback) {
        this.on(event, callback, { one: 1 });
    }

    off(event, callback) {
        for (var name in this._namespaces) {
            this._namespaces[name].off(event, callback);
        }

        if (!this._handlers[event]) {
            return;
        }

        if (callback === undefined) {
            this._handlers[event] = [];
            return;
        }

        var handlers = this._handlers[event];
        var idxToDel = [];

        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i].callback === callback) {
                idxToDel.push(i);
            }
        }

        for (var i = 0; i < idxToDel.length; i++) {
            handlers.splice(idxToDel[i] - i, 1);
        }
    }

    emit(event, data) {
        if (this._handlers[event]) {
            var handlers = this._handlers[event];
            var idxToDel = [];

            for (var i = handlers.length - 1; i >= 0; i--) {
                handlers[i].callback(data);

                if (handlers[i] && handlers[i].one) {
                    idxToDel.push(i);
                }
            }

            for (var i = 0; i < idxToDel.length; i++) {
                handlers.splice(idxToDel[i] - i, 1);
            }
        }

        for (var name in this._namespaces) {
            this._namespaces[name].emit(event, data);
        }
    }

    namespace(name) {
        if (this.parent) {
            throw new Error('Eventer: generic namespaces are not allowed!');
        }

        if (!this._namespaces[name]) {
            this._namespaces[name] = new window.Eventer(this);
        }

        return this._namespaces[name];
    }
}
