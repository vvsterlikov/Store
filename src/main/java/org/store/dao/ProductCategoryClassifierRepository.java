package org.store.dao;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.store.domain.ProductCategoryClassifier;

@RepositoryRestResource(collectionResourceRel = "category", path = "productCategoryClassifierVanilla")
public interface ProductCategoryClassifierRepository extends PagingAndSortingRepository <ProductCategoryClassifier, Long> {

}
