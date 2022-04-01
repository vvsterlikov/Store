package org.store.controller;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import static org.assertj.core.api.Assertions.assertThat;


import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Disabled
class HomeControllerTest {
    @Autowired
    private HomeController homeController;

    @PersistenceContext
    private EntityManager em;

    @Test
    public void contextLoads() throws Exception {
        System.out.println("hello");
        //assertThat(homeController).isNotNull();
        assertThat(homeController).isNotNull();
        assertThat(em).isNotNull();
    }
}