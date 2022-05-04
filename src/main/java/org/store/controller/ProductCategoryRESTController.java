package org.store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.server.ExposesResourceFor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.store.domain.ProductCategory;
import org.store.service.ProductCategoryService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productCategories")
@CrossOrigin
public class ProductCategoryRESTController {
    @Autowired
    ProductCategoryService service;
    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllCategoriesPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        List<ProductCategory> productCategories = new ArrayList<>();
        Pageable paging = PageRequest.of(page, size);
        Page<ProductCategory> pageProductCategories;
        pageProductCategories = service.getAllCategPaging(paging);
        productCategories = pageProductCategories.getContent();
        Map<String,Object> response = new HashMap<>();
        response.put("productCategories",productCategories);
        response.put("currentPage",pageProductCategories.getNumber());
        response.put("totalItems",pageProductCategories.getTotalElements());
        response.put("totalPages",pageProductCategories.getTotalPages());

        return new ResponseEntity(response, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<ProductCategory> save(@RequestBody ProductCategory pc) {
        System.out.println("save controller");
        return new ResponseEntity(service.save(pc),HttpStatus.OK);
    }
    @GetMapping(value = "/getAllRecords")
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        return new ResponseEntity(service.getAllCateg(), HttpStatus.OK);
    }

    @GetMapping(value = "/getAvailableParents/{id}")
    public ResponseEntity<List<ProductCategory>> getAvailableParents(
            @PathVariable String id
    ){
        System.out.println("getAvailableParents with id begin");
        System.out.println("id1="+id);
        return new ResponseEntity(service.getAvailableParents(id), HttpStatus.OK);
    }
    @GetMapping(value = "/getAvailableParents")
    public ResponseEntity<List<ProductCategory>> getAvailableParents(){
        System.out.println("getAvailableParents no id begin");
        return new ResponseEntity(service.getAvailableParents(""), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateProductCategory(
            @PathVariable(value="id") Long id,
            @RequestBody ProductCategory pc
    ) {
        System.out.println("id="+id);
        System.out.println("parent id="+pc.getId());
        return null;
    }
}
