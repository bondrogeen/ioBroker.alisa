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
		// this.on('message', this.onMessage.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	setValue(id, val) {
		if (!id && typeof val !== 'undefined') {
			this.log.warn(JSON.stringify({ id, val }));
			return;
		}
		if (this.existingStates[id]) {
			this.setState(id, { val: getVal(val), ack: true });
		} else {
			this.getState(id, (err, obj) => {
				if (obj === null) {
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

		// let result = await this.checkPasswordAsync("admin", "iobroker");

		// this.log.info("check user admin pw iobroker: " + result);

		// result = await this.checkGroupAsync("admin", "admin");
		// this.log.info("check group user admin group admin: " + result);
	}
	onUnload(callback) {
		this.log.info('callback');
		try {
			callback();
		} catch (e) {
			callback();
		}
	}

	// onObjectChange(id, obj) {
	//   if (obj) {
	//     // The object was changed
	//     this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	//   } else {
	//     // The object was deleted
	//     this.log.info(`object ${id} deleted`);
	//   }
	// }

	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);

			// this.alisa.onSend("FF98F0299D8593E41F504368", {
			//   command: "sendText",
			//   text: state.val,
			// });
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === 'object' && obj.message) {
	// 		if (obj.command === 'send') {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info('send command');

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
	// 		}
	// 	}
	// }
}

if (require.main !== module) {
	module.exports = (options) => new Alisa(options);
} else {
	new Alisa();
}
