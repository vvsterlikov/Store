package org.store.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.store.dao.ProductCategoryDAO;
import org.store.dao.ProductCategoryRepository;
import org.store.domain.ProductCategory;

import java.util.List;

@Service
public class ProductCategoryService {
    @Autowired
    //private ProductCategoryDAO pcDAO;
    private ProductCategoryRepository pcDAO;

    @Autowired
    private ProductCategoryDAO pcDAOCustom;

    //public List<ProductCategory> getAllCateg() {
    //    return pcDAO.findAll();
    //}
    public Page<ProductCategory> getAllCategPaging(Pageable p) {
        return pcDAO.findAll(p);
    }
    public ProductCategory save(ProductCategory pc) {
        return  pcDAOCustom.save(pc);
    }
}
