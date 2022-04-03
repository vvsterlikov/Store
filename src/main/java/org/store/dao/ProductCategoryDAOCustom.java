package org.store.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.store.domain.ProductCategory;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaUpdate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductCategoryDAOCustom {
    @PersistenceContext
    private EntityManager em;


    public long countByName(String name) {
        return (Long) em.createQuery("select count(pc) from ProductCategory pc where name = :name")
                .setParameter("name",name)
                .getSingleResult();
    }

    @Transactional
    public ProductCategory save(ProductCategory pc) {
        System.out.println("begin save");
        if (pc.getParent() == null || pc.getParent().getName() == "") {
            System.out.println("no parent, save");
            //em.persist(new ProductCategory(pc.getName()));
            em.persist(pc);
        }
        else if (pc.getParent().getName() != "") {
            System.out.println("has parent");
            long parCnt = countByName(pc.getParent().getName());
            if (parCnt == 1) {
                System.out.println("parent count=1, save record");
                em.persist(pc);
            }
            else if (parCnt == 0) {
                System.out.println("parent count=0, first save parent");
                em.persist(pc.getParent());

            }

            System.out.println("сохранение объекта с родителем end");
            String parName = pc.getParent().getName();

            ProductCategory par = (ProductCategory) em.createQuery("select pc from ProductCategory pc where pc.name = :name")
                            .setParameter("name",parName).getSingleResult();
            //Long parId = par.get(0).getId();

            em.persist(new ProductCategory(pc.getName(),par));
            em.flush();
            //System.out.println("сохранение объекта с родителем end"+parId);

        }
        System.out.println("end save");
        return pc;
    }
    @Transactional
    public List<ProductCategory> getAvailableParentsById(Long id) {
        ProductCategory pc = (ProductCategory) em.createQuery("select pc from ProductCategory pc where pc.id = :pcId")
                .setParameter("pcId",id)
                .getSingleResult();
        if (pc.getChildren().size() == 0) {
            return em.createQuery("select pc from ProductCategory pc where pc.id <> :pcId")
                    .setParameter("pcId",id)
                    .getResultList();
        }
        else {
            String query = "select * from ProductCategory";
            return em.createNativeQuery(query).getResultList();

        }
        //return  null;
    }

    public long countAll() {
        return (long) em.createQuery("select count(pc) from ProductCategory pc").getSingleResult();
    }

    public  ProductCategory getProductCategoryByName(String name) {
        return (ProductCategory) em.createQuery("select pc from ProductCategory pc where pc.name = :pcName")
                .setParameter("pcName",name)
                .getSingleResult();
    }
    @Transactional
    public int updateStringAttr(Long id, String attrName, String newVal) {
        System.out.println("begin updateStringAttr");
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaUpdate<ProductCategory> criteriaUpdate = cb.createCriteriaUpdate(ProductCategory.class);
        Root<ProductCategory> pcRoot = criteriaUpdate.from(ProductCategory.class);
        criteriaUpdate.set(pcRoot.get(attrName),newVal)
                .where(cb.equal(pcRoot.get("id"),id));
        int i = em.createQuery(criteriaUpdate).executeUpdate();
        return i;
    }

    public List<ProductCategory> getAll() {
        return (List<ProductCategory>) em.createQuery("select pc from ProductCategory pc")
                .getResultList();
    }

    public void printAll() {
        System.out.println("begin print");
        for (ProductCategory p : this.getAll()) {
            System.out.println(p);
        }
        System.out.println("begin print");
    }

}
