package org.store.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Objects;

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
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCode() { return code;}
    public void setCode(String code) {
        this.code = code;
    }
    public Long getVersion() { return version; }
    public void setVersion(Long version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ProductCategory p = (ProductCategory) o;
        return Objects.equals(id, p.id) &&
                Objects.equals(name, p.name) &&
                Objects.equals(code, p.code) &&
                Objects.equals(version, p.version);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id,name,code,version);
    }
    @Override
    public String toString() {
        return String.format("ProductCategory[id=%d,name=%s,code=%s,version=%d]",id,name,code,version);
    }
}
