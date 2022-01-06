package org.store.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.store.domain.ProductCategory;

//import java.util.List;

public interface ProductCategoryRepository extends PagingAndSortingRepository<ProductCategory, Long> {
    //ProductCategory findById(long id);
    //List<ProductCategory> findAll();
}
