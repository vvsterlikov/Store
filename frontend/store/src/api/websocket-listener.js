/*
'use strict';
const SockJS = require('sockjs-client');
const Stomp = require('stompjs');
module.exports = (clientId, registrations) => {
	const socket = SockJS('/classifier');
	const headers = {
		login : clientId,
		passcode : clientId,
		'clientId' : clientId,
	};
	const stompClient = Stomp.over(socket);
	stompClient.connect(headers, frame => {
		registrations.forEach(registration => stompClient.subscribe(registration.route,registration.callback, {id : "const"}));
	});
}
*/
/*
'use strict';
const SockJS = require('sockjs-client');
const StompJs = require('@stomp/stompjs');
const client = new StompJs.Client({
	webSocketFactory : () => {
		const sock = SockJS('/classifier');
		sock.onopen = () => {
			console.log("sock open");
		};
		sock.onmessage = (msg) => {
			console.log("msg="+msg);
		};
		return sock;
	},
	connectHeaders : {
		login : 'user',
		passcode : 'password',
		sessionId : 'generatedsessid',
	},
	debug : function(str) {
		console.log(str);
	},
	reconnectDelay : 5000,
	heartbeatIncoming : 4000,
	heartbitOutcoming : 4000,
});


client.onStompError = function(frame) {
	console.log("err");
};


module.exports = subscriptionHandler => {
	client.onConnect = function(frame) {
		let ws = client.webSocket;
		let f = frame;
		console.log("connected");
		client.subscribe('/topic/updateProductCategory',subscriptionHandler)
	};
	client.activate();
};
*/

RxStomp = require('@stomp/rx-stomp');
const SockJS = require('sockjs-client');

const rxStomp = new RxStomp.RxStomp();

rxStomp.configure({
	webSocketFactory : () => {
		const sock = SockJS('/classifier');
		return sock;
	},
	connectHeaders : {
		login : 'guest',
		passcode : 'guest',
	},
	heartbeatIncoming: 0,
	heartbeatOutgoing: 20000,
	reconnectDelay: 200,
	debug: msg => {
		console.log("DEBUG: "+msg);
		let h = rxStomp.serverHeaders$;
	}
});

module.exports = subscriptionHandler => {
	let subscription = rxStomp.watch('/topic/updateProductCategory').subscribe(payload => {
		subscriptionHandler(payload);
	});
	rxStomp.activate();
}
