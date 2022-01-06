package org.store.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.store.domain.ProductCategory;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class ProductCategoryDAO {
    @PersistenceContext
    private EntityManager em;

    public List<ProductCategory> findAll() {
        return em.createQuery("select pc from ProductCategory pc").getResultList();
    }
}
