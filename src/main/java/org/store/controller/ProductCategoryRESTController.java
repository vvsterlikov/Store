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
public class ProductCategoryRESTController {
    @Autowired
    ProductCategoryService service;
    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllCategories(
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
        System.out.println("save");
        return new ResponseEntity(service.save(pc),HttpStatus.OK);
    }
}
