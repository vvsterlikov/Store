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
import java.util.List;

@Repository
public class ProductCategoryDAO {
    @PersistenceContext
    private EntityManager em;

    @Transactional
    public ProductCategory save(ProductCategory pc) {
        em.persist(pc);
        return pc;
    }

}
