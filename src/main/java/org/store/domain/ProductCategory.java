package org.store.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String code;

    protected ProductCategory() {}

    public ProductCategory(String name, String code) {
        this.name = name;
        this.code = code;
    }
    @Override
    public String toString() {
        return String.format("ProductCategory[id=%d,name=%s,code=%s]",id,name,code);
    }
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getCode() { return code;}
}
