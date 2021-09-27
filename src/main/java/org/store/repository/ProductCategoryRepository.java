package org.store.repository;

import org.springframework.data.repository.CrudRepository;
import org.store.domain.ProductCategory;

//import java.util.List;

public interface ProductCategoryRepository extends CrudRepository<ProductCategory, Long> {
    ProductCategory findById(long id);
    //List<ProductCategory> findAll();
}
