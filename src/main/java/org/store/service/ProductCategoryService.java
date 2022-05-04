package org.store.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.store.dao.ProductCategoryDAOCustom;
import org.store.dao.ProductCategoryDAO;
import org.store.domain.ProductCategory;

import java.util.List;

@Service
public class ProductCategoryService {
    @Autowired
    //private ProductCategoryDAO pcDAO;
    private ProductCategoryDAO pcDAO;

    @Autowired
    private ProductCategoryDAOCustom pcDAOCustom;

    //public List<ProductCategory> getAllCateg() {
    //    return pcDAO.findAll();
    //}
    public Page<ProductCategory> getAllCategPaging(Pageable p) {
        return pcDAO.findAll(p);
    }
    public ProductCategory save(ProductCategory pc) {
        System.out.println("save service");
        return pcDAOCustom.save(pc);
    }
    public List<ProductCategory> getAllCateg() {
        return (List<ProductCategory>) pcDAO.findAll();
    }

    public List<ProductCategory> getAvailableParents(String id) {
        if (id.isEmpty()) {
            return pcDAOCustom.getAllEagerly();
        }
        return pcDAOCustom.getAvailableParentsById(Long.parseLong(id));
    }

}
