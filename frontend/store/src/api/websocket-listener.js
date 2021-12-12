'use strict';
const SockJS = require('sockjs-client');
const Stomp = require('stompjs');
module.exports = registrations => {
	const socket = SockJS('/classifier');
	const stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		registrations.forEach(registration => stompClient.subscribe(registration.route,registration.callback));
	});
}