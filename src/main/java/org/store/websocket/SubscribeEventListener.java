package org.store.websocket;

import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

@Component
public class SubscribeEventListener implements ApplicationListener<SessionSubscribeEvent> {
    @Override
    public void onApplicationEvent (SessionSubscribeEvent sessionSubscribeEvent) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(sessionSubscribeEvent.getMessage());
        //System.out.println("subscribed:"+headerAccessor.getSessionId().toString());
        System.out.println("subscribed sessionId"+headerAccessor.getSessionAttributes().get("sessionId").toString());
        headerAccessor.setHeader("customSessId",headerAccessor.getSessionAttributes().get("sessionId").toString());
    }


}
