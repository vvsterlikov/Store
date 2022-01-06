package org.store.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.store.dao.ProductCategoryClassifierRepository;
import org.store.domain.ProductCategoryClassifier;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class ProductCategoryClassifierService {

    @PersistenceContext
    protected EntityManager em;
    /*
    public List<ProductCategoryClassifier> getCategories() {
        CriteriaQuery<ProductCategoryClassifier> c = em.getCriteriaBuilder().createQuery(ProductCategoryClassifier.class);
        c.select(c.from(ProductCategoryClassifier.class));
        return em.createQuery(c).getResultList();
    }
     */
    @Autowired
    private ProductCategoryClassifierRepository productCategoryClassifierRepository;
    public List<ProductCategoryClassifier> getCategories() {
        return (List<ProductCategoryClassifier>) productCategoryClassifierRepository.findAll();
    }

    public List<ProductCategoryClassifier> getAvailableChildCategories(Long curId) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<ProductCategoryClassifier> c = cb.createQuery(ProductCategoryClassifier.class);
        Root<ProductCategoryClassifier> root = c.from(ProductCategoryClassifier.class);
        c.select(root).where(cb.notEqual(root.get("id"),curId));
        return  em.createQuery(c).getResultList();
    }
}
