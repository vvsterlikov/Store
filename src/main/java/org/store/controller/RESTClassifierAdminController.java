package org.store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.ExposesResourceFor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.store.domain.ProductCategory;
import org.store.service.ProductCategoryClassifierService;
import org.store.domain.ProductCategoryClassifier;

import java.util.List;

@RestController
@RequestMapping(value = "/api/productCategoryClassifier1")
public class RESTClassifierAdminController {
    @Autowired
    public ProductCategoryClassifierService productCategoryClassifierService;

    @GetMapping
    public ResponseEntity<List<ProductCategoryClassifier>> getCategories() {
        List<ProductCategoryClassifier> productCategoryClassifier = productCategoryClassifierService.getCategories();
        return new ResponseEntity<>(productCategoryClassifier, HttpStatus.OK);
    }
    @GetMapping(value = "/getchildcateg/{id}")
    public ResponseEntity<List<ProductCategoryClassifier>> getCategories(@PathVariable Long id) {
        List<ProductCategoryClassifier> productCategoryClassifier = productCategoryClassifierService.getAvailableChildCategories(id);
        return new ResponseEntity<>(productCategoryClassifier, HttpStatus.OK);
    }

}
