package org.store.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String code;
    private @Version @JsonIgnore Long version;

    protected ProductCategory() {}

    public ProductCategory(String name, String code) {
        this.name = name;
        this.code = code;
        Objects.
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
