package org.store.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.store.domain.ProductCategory;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductCategoryDAOCustom {
    @PersistenceContext
    private EntityManager em;

    @Transactional
    public ProductCategory save(ProductCategory pc) {
        System.out.println("save repository");
        if (pc.getParent() == null || pc.getParent().getName() == "") {
            em.persist(new ProductCategory(pc.getName()));
        }
        else if (pc.getParent().getName() != "") {
            System.out.println("сохранение объекта с родителем end");
            String parName = pc.getParent().getName();

            ProductCategory par = (ProductCategory) em.createQuery("select pc from ProductCategory pc where pc.name = :name")
                            .setParameter("name",parName).getSingleResult();
            //Long parId = par.get(0).getId();

            em.persist(new ProductCategory(pc.getName(),par));
            em.flush();
            //System.out.println("сохранение объекта с родителем end"+parId);

        }
        return pc;
    }
    public List<ProductCategory> getAvailableParents(Long id) {
        return  null;
    }

    public  ProductCategory getProductCategoryByName(String name) {
        return (ProductCategory) em.createQuery("select pc from ProductCategory pc where pc.name = :pcName")
                .setParameter("pcName",name)
                .getSingleResult();
    }

}
