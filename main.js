'use strict';
const utils = require('@iobroker/adapter-core');
const yandexDevice = require('alisa-npm').default;

const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);

const getTypeValue = (val) => {
	const type = ['string', 'number', 'boolean'].includes(typeof val) ? typeof val : 'mixed';
	return type;
};

const getVal = (val) => (getTypeValue(val) === 'mixed' ? JSON.stringify(val) : val);

const ignoreKeys = ['experiments'];

const getTree = (id, obj, cb, ignore = []) => {
	for (const key in obj) {
		if (isObject(obj[key]) && !ignore.includes(key)) {
			getTree(`${id}.${key}`, obj[key], cb, ignore);
		} else {
			cb(`${id}.${key}`, obj[key]);
		}
	}
};

class Alisa extends utils.Adapter {
	constructor(options) {
		super({ ...options, name: 'alisa' });
		this.existingStates = {};
		this.alisa = new yandexDevice();
		this.alisa.on('data', this.onAlisaMessage.bind(this));
		this.on('ready', this.onReady.bind(this));
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	setValue(id, val) {
		if (!id && typeof val !== 'undefined') {
			this.log.warn(JSON.stringify({ id, val }));
			return;
		}
		// this.log.info(`1) ${id}`);
		if (this.existingStates[id]) {
			// this.log.info(`2) ${id}`);
			this.setState(id, { val: getVal(val), ack: true });
		} else {
			// this.log.info(`3) ${id}`);
			this.getState(id, (err, obj) => {
				// this.log.info(`4) ${id}`);
				if (obj === null) {
					// this.log.warn(JSON.stringify(obj));
					this.setObjectNotExists(id, {
						type: 'state',
						common: {
							name: id.split('.')[id.split('.').length - 1],
							type: getTypeValue(val),
							role: 'indicator',
							read: true,
							write: true,
						},
						native: {},
					});
				}
				this.existingStates[id] = true;
				this.setValue(id, val);
			});
		}
	}

	onAlisaMessage(message) {
		let id = `devices.${message.id}`;
		const type = message.type;
		for (const key in message) {
			const value = message[key];
			if (key === 'data') {
				id = `${id}.${type}`;
				getTree(id, value, (id, value) => this.setValue(id, value), ignoreKeys);
			} else {
				this.setValue(`${id}.${key}`, value);
			}
		}
	}

	async onReady() {
		this.log.info(JSON.stringify(this.config));
		try {
			this.alisa.setToken(this.config.token);
			const res = await this.alisa.connection();
			const localDevices = res?.localDevices || [];

			this.log.warn(JSON.stringify(localDevices));

			localDevices.forEach((device) => {
				let id = `devices.${device.id}`;
				this.setValue(`${id}.command`, '');
			});
			this.setValue(`command`, '');
			this.subscribeStates('command');
			getTree('info', res, (id, value) => this.setValue(id, value), ignoreKeys);
		} catch (error) {
			this.log.warn(JSON.stringify(error));
		}
	}
	onUnload(callback) {
		this.log.info('callback');
		try {
			callback();
		} catch (e) {
			callback();
		}
	}

	onStateChange(id, state) {
		if (state) {
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);

			// this.alisa.onSend("FF98F0299D8593E41F504368", {
			//   command: "sendText",
			//   text: state.val,
			// });
		} else {
			this.log.info(`state ${id} deleted`);
		}
	}

	async onMessage(obj) {
		if (typeof obj === 'object' && obj.message) {
			this.log.info(JSON.stringify(obj));
			if (obj.command === 'scan') {
				const res = await this.alisa.scan();
				if (obj.callback) this.sendTo(obj.from, obj.command, res, obj.callback);
			}
			if (obj.command === 'token') {
				const res = await this.alisa.getYandexToken(obj.message);
				if (obj.callback) this.sendTo(obj.from, obj.command, res, obj.callback);
			}
		}
	}
}

if (require.main !== module) {
	module.exports = (options) => new Alisa(options);
} else {
	new Alisa();
}
