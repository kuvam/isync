'use strict';

const
    emitter = require('events'),
    fs = require('fs');

class instance extends emitter {
    constructor (path, period = 10) {
        super();
        
        this.path = path;
        this.period = period;

        const fd = fs.openSync(this.path, fs.constants.O_RDONLY | fs.constants.O_CREAT);
        this.data = JSON.parse(fs.readFileSync(fd, 'utf-8') || '{}');
        fs.closeSync(fd);

        this.link();
    }

    flush (link) {
        fs.writeFile(this.path, JSON.stringify(this.data), null, () => {
            this.emit('flush');
            if (link)
                this.link();
        });
    }

    flushSync () {
        fs.writeFileSync(this.path, JSON.stringify(this.data), null);
        this.emit('flush');
    }

    link () {
        clearTimeout(this.interval);
        this.interval = setTimeout(() => this.flush(true), this.period * 60 * 1000); // DevSkim: reviewed DS172411
    }

    unlink () {
        clearTimeout(this.interval);
    }
}

module.exports = instance;
