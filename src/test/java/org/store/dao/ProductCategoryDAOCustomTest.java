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
        pc = pcDAO.getByNameEagerly("pc");
        assertEquals("pc",pc.getName());
        assertEquals(0,pc.getChildren().size());
    }

    @Test
    public void saveWithChildren() {
        ProductCategory pc = new ProductCategory("pcPar");
        pc.addChildCategory(new ProductCategory("pcChild1"));
        pcDAO.save(pc);
        pc = pcDAO.getProductCategoryByName("pcPar");
        assertEquals("pcPar", pc.getName());
        assertEquals("pcChild1",pcDAO.getByNameEagerly("pcPar")
                .getChildren().get(0).getName());
        assertEquals(2,pcDAO.countAll());
        pcDAO.printAll();
        System.out.println("saveWithChildren end");

    }

    @Test
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
        ProductCategory pc = new ProductCategory("pc");
        ProductCategory pc1 = new ProductCategory("pc1");
        ProductCategory pc2 = new ProductCategory("pc2");
        pcDAO.save(pc);
        pcDAO.save(pc1);
        pcDAO.save(pc2);

        pc = pcDAO.getProductCategoryByName("pc");

        assertEquals(2,pcDAO.getAvailableParentsById(pc.getId()).size());
    }
    @Test
    public void getAvailableParentsByIdHasChildren() {
        ProductCategory par1 = new ProductCategory("par1");
        ProductCategory child1 = new ProductCategory("child1",par1);
        ProductCategory child2 = new ProductCategory("child2",par1);
        ProductCategory child3 = new ProductCategory("child3",par1);
        ProductCategory par2 = new ProductCategory("par2");

        ProductCategory child11 = new ProductCategory("child11",child1);
        ProductCategory child12 = new ProductCategory("child12",child1);

        ProductCategory child111 = new ProductCategory("child111",child11);
        ProductCategory child112 = new ProductCategory("child112",child11);

        pcDAO.save(par1);
        pcDAO.save(par2);
        pcDAO.save(child1);
        pcDAO.save(child2);
        pcDAO.save(child3);

        pcDAO.save(child11);
        pcDAO.save(child12);

        pcDAO.save(child111);
        pcDAO.save(child112);

        ProductCategory pc = pcDAO.getByNameEagerly("child1");

        assertEquals(9, pcDAO.countAll());
        pcDAO.printAll();

        pcDAO.getAvailableParentsById(pc.getId());


    }

    @Test
    public void countByName() {
        ProductCategory pc = new ProductCategory("countByName");
        pcDAO.save(pc);
        assertEquals(1, pcDAO.countByName("countByName"));
    }



}