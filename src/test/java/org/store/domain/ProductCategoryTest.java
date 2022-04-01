package org.store.domain;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;


class ProductCategoryTest {
    @Test
    public void equals() {
        ProductCategory pcPar1 = null;
        ProductCategory pcPar2 = new ProductCategory("par2");;
        assertNotEquals(pcPar1, pcPar2);

        ProductCategory pc1 = new ProductCategory("pc1");
        ProductCategory pc2 = new ProductCategory("pc1");
        assertEquals(pc1,pc2);

        pc2.setParent(pcPar1);
        assertEquals(pc1,pc2);

        pc2.setParent(pcPar2);
        assertNotEquals(pc1,pc2);

        pc1.setParent(pcPar2);
        assertEquals(pc1,pc2);

        pc2.setName("pc2");
        assertNotEquals(pc1,pc2);

        pc1.setName("name");
        pc2.setName("name");
        pcPar1 = new ProductCategory("pc");
        pcPar2.setName("pc");
        assertEquals(pcPar1,pcPar2);

        pc1.setParent(pcPar1);
        pc2.setParent(pcPar2);
        assertEquals(pcPar1,pcPar2);

    }

    @Test
    public void hash() {
        //assert
    }

}