import Eventer from '../lib/Eventer';

class Placement extends Eventer {
    constructor(name, options) {
        super();

        this.name = name;
        this.id = options.place_id;
        this.options = options;
        this.status = '';
    }

    updateStatus(status) {
        this.status = status;
        this.emit('update_status', {status: this.status});
    }
}

export default Placement;
