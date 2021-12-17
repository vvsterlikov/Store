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