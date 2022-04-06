package org.store.dao;

import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.store.domain.ProductCategory;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
//@Disabled
class ProductCategoryDAOCustomTest {
    @Autowired
    private ProductCategoryDAOCustom pcDAO;

    @BeforeEach
    public void deleteRecords() {
        pcDAO.deleteAll();
    }

    @Test
    public void deleteAllTest() {
        assertEquals(0,pcDAO.countAll());
    }

    @Test
    public void saveNoChildren() {
        ProductCategory pc = new ProductCategory("pc");
        pcDAO.save(pc);
        pc = pcDAO.getProductCategoryByName("pc");
        assertEquals("pc",pc.getName());
        assertEquals(0,pc.getChildren().size());
    }

    @Test
    public void saveWithChildren() {
        //System.out.println("saveWithChildren begin");
        ProductCategory pc = new ProductCategory("pcPar");
        pc.addChildCategory(new ProductCategory("pcChild1"));
        pcDAO.save(pc);
        pc = pcDAO.getProductCategoryByName("pcPar");
        assertEquals("pcChild1",pc.getChildren().get(0).getName());
        //pcDAO.printAll();
        //System.out.println("saveWithChildren end");

    }

    @Test
    @Disabled
    public void save() {
        assertNotNull(pcDAO);
        ProductCategory pcParent = new ProductCategory("Родитель1");
        pcDAO.save(pcParent);
        ProductCategory pcParentFromDB = pcDAO.getProductCategoryByName("Родитель1");
        assertEquals(pcParent.getName(),pcParentFromDB.getName());
        ProductCategory pc = new ProductCategory("Потомок1",pcParent);

        pcDAO.printAll();

        pcDAO.save(pc);

        pcDAO.printAll();

        ProductCategory pcFromDB = pcDAO.getProductCategoryByName("Потомок1");
        assertEquals("Родитель1",pcFromDB.getParent().getName());

        //assertEquals(pcParentFromDB.getChildren().get(0).getName(),"Потомок1");

        //assertTrue(Objects.equals(pcParent,pcParentFromDB));

    }
    @Test
    //@Transactional
    public void updateTest() {
        ProductCategory pc = new ProductCategory("pc1");
        pcDAO.save(pc);
        ProductCategory pcFromDB1 = pcDAO.getProductCategoryByName("pc1");

        int updCnt = pcDAO.updateStringAttr(pcFromDB1.getId(),"name","pc2");

        assertEquals(1,updCnt);

        ProductCategory pcFromDB2 = pcDAO.getProductCategoryByName("pc2");
        assertEquals("pc1",pcFromDB1.getName());
        assertEquals("pc2",pcFromDB2.getName());
        //assertEquals(pcFromDB1.getId(),pcFromDB2.getId());
    }

    @Test
    public void getAvailableParentsByIdNoChildren() {
        long cntBefore = pcDAO.countAll();
        ProductCategory pc = new ProductCategory("pc");
        pcDAO.save(pc);
        pc = pcDAO.getProductCategoryByName("pc");


        long cntPar = pcDAO.getAvailableParentsById(pc.getId()).size();
        assertEquals(cntBefore,cntPar);
    }
    @Test
    public void getAvailableParentsByIdHasChildren() {
        ProductCategory par1 = new ProductCategory("par1");
        ProductCategory par2 = new ProductCategory("par2",par1);

        //pcDAO.save(par2);

    }

    @Test
    public void countByName() {
        ProductCategory pc = new ProductCategory("countByName");
        pcDAO.save(pc);
        assertEquals(1, pcDAO.countByName("countByName"));
    }



}