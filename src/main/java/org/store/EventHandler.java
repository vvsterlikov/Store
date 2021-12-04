package org.store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.store.domain.ProductCategory;

import static org.store.WebSocketConfiguration.MESSAGE_PREFIX;

@Component
@RepositoryEventHandler
public class EventHandler {
    private final SimpMessagingTemplate websocket;
    private final EntityLinks entityLinks;
    @Autowired
    public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }
    @HandleAfterCreate
    public void newProductCategory(ProductCategory productCategory) {
        this.websocket.convertAndSend(MESSAGE_PREFIX + "/newProductCateпory",getPath(productCategory));
    }
    @HandleAfterDelete
    public void deleteProductCategory(ProductCategory productCategory) {
        this.websocket.convertAndSend(MESSAGE_PREFIX + "/deleteProductCateпory",getPath(productCategory));
    }
    @HandleAfterSave
    public void updateProductCategory(ProductCategory productCategory) {
        this.websocket.convertAndSend(MESSAGE_PREFIX + "/updateProductCateпory",getPath(productCategory));
    }

    private String getPath(ProductCategory productCategory) {
        return this.entityLinks.linkForItemResource(productCategory.getClass(),productCategory.getId()).toUri().getPath();
    }
}
