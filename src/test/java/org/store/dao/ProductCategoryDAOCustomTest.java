package org.store.dao;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Repository;
import org.store.domain.ProductCategory;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductCategoryDAOCustomTest {
    @Autowired
    private ProductCategoryDAOCustom pcDAO;

    @Test
    public void save() {
        assertNotNull(pcDAO);
        ProductCategory pcParent = new ProductCategory("Родитель1");
        pcDAO.save(pcParent);
        ProductCategory pcParentFromDB = pcDAO.getProductCategoryByName("Родитель1");
        assertEquals(pcParent,pcParentFromDB);
        ProductCategory pc = new ProductCategory("Потомок1",pcParent);
        pcDAO.save(pc);

        ProductCategory pcFromDB = pcDAO.getProductCategoryByName("Потомок1");

        assertEquals(pc,pcFromDB);

    }



}