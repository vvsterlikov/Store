package org.store;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.util.MultiValueMap;

import static java.util.Objects.isNull;
import static org.springframework.messaging.simp.stomp.StompCommand.CONNECTED;

public class CustomOutboundChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        System.out.println("presend invoked");
        final StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        final StompCommand command = headerAccessor.getCommand();
        if (!isNull(command)) {
            System.out.println("command="+command.name());
            switch (command) {
                case CONNECT:
                    System.out.println("connected!");
                    final StompHeaderAccessor accessor = StompHeaderAccessor.create(headerAccessor.getCommand());
                    accessor.setSessionId(headerAccessor.getSessionId());
                    final MultiValueMap<String, String> nativeHeaders = (MultiValueMap<String, String>) headerAccessor.getHeader(StompHeaderAccessor.NATIVE_HEADERS);
                    accessor.addNativeHeaders(nativeHeaders);
                    accessor.setHeader("customheader","customheader");
                    accessor.addNativeHeader("CUSTOM01", "CUSTOM01");
                    Message<?> newMessage = MessageBuilder.createMessage(message.getPayload(),accessor.getMessageHeaders());
                    return newMessage;
                default:
                    break;
            }
        }
        return message;
    }
}
