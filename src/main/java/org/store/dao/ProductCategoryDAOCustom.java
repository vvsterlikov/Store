package org.store.dao;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.store.domain.ProductCategory;

import javax.persistence.*;
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
        /*
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

         */
        em.persist(pc);
        return pc;
    }

    @SqlResultSetMapping(name="ProductCategoryResult", classes = {
            @ConstructorResult(targetClass = ProductCategory.class,
                    columns = {
                        @ColumnResult(name="id"),
                            @ColumnResult(name="parent_id")
            })
    })
    @Transactional
    public List<ProductCategory> getAvailableParentsById(Long id) {
        ProductCategory pc = em.find(ProductCategory.class,id);

        if (pc.getChildren().size() == 0) {
            return em.createQuery("select pc from ProductCategory pc where pc.id <> :pcId")
                    .setParameter("pcId",id)
                    .getResultList();
        }
        else {
            String query = "with recursive r(id) as (\n" +
                    "select id\n" +
                    "from product_category\n" +
                    "where id = :id\n" +
                    "union all\n" +
                    "select pc.id from product_category pc join r on pc.parent_id = r.id\n" +
                    ") \n" +
                    "select t1.id from product_category t1 where t1.id not in (select id from r)";
            Query q = em.createNativeQuery(query,"");
            List<ProductCategory> result = em.createNativeQuery(query)
                    .setParameter("id",id)
                    .getResultList();
            return null;

        }
        //return  null;
    }

    public List<ProductCategory> getByIds(List<Long> ids) {
        List<ProductCategory> result = new ArrayList<>();
        return null;
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
    public ProductCategory getByNameEagerly(String name) {
        //ProductCategory pc = (ProductCategory) em.createQuery("select pc from ProductCategory pc left join fetch pc.children where pc.name = :n")
        ProductCategory pc = (ProductCategory) em
                .createQuery("select pc from ProductCategory pc  where pc.name = :n")
                .setParameter("n",name)
                .getSingleResult();
        System.out.println("before initial");
        Hibernate.initialize(pc.getChildren());
        System.out.println("after initial");
        return pc;
    }
    @Transactional
    public String getChildName(String name) {
        //ProductCategory pc = (ProductCategory) em.createQuery("select pc from ProductCategory pc left join fetch pc.children where pc.name = :n")
        ProductCategory pc = (ProductCategory) em.createQuery("select pc from ProductCategory pc  where pc.name = :n")
                .setParameter("n",name)
                .getSingleResult();
        Long id = pc.getId();
        //pc = em.find(ProductCategory.class,id);
        PersistenceUtil pu = Persistence.getPersistenceUtil();
        //em.refresh(pc);
        System.out.println("!!loaded "+pu.isLoaded(pc,"children"));
        List<ProductCategory> children = pc.getChildren();
        String result = children.get(0).getName();
        return result;
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

    public ProductCategory findOneEagerly(Long id) {
        ProductCategory pc = em.find(ProductCategory.class,id);
        Hibernate.initialize(pc.getChildren());
        return pc;
    }

    public List<ProductCategory> getAllEagerly() {
        return (List<ProductCategory>) em
                .createQuery("select distinct pc from ProductCategory pc left join fetch pc.children",ProductCategory.class)
                .getResultList();
    }

    public void printAll() {
        List<ProductCategory> list = this.getAllEagerly();
        for (ProductCategory p : list) {
                System.out.println(p);
            }
    }

    @Transactional
    public void deleteAll() {
        em.createQuery("delete ProductCategory").executeUpdate();
        return;
    }
}
