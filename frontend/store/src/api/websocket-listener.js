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
'use strict';
const SockJS = require('sockjs-client');
const StompJs = require('@stomp/stompjs');
const client = new StompJs.Client({
	webSocketFactory : () => {
		return SockJS('/classifier');
	},
	connectHeaders : {
		login : 'user',
		passcode : 'password',
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
		console.log("connected");
		subscriptionHandler();
	};
	client.activate();
};