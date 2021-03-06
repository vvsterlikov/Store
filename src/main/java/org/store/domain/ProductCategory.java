package org.store.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@JsonIgnoreProperties({"hibernateLazyInitializer"})
@Entity
@org.hibernate.annotations.NamedNativeQuery(
        name = "AvailParents",
        query = "with recursive r(id) as (\n"+
                "select id from product_category where id = ?1\n"+
                "union all\n"+
                "select pc.id from product_category pc join r on pc.parent_id = r.id)\n"+
                "select id, name from product_category where id not in (select id from r)",
        resultSetMapping = "IdMapping"
)
@SqlResultSetMapping(
        name = "IdMapping",
        classes = {
          @ConstructorResult(
                  targetClass = ProductCategory.class,
                  columns={
                          @ColumnResult(name="id", type=Long.class),
                          @ColumnResult(name="name", type=String.class)
                  }
          )
        }
)
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    //private @Version @JsonIgnore Long version;

    protected ProductCategory() {}

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private ProductCategory parent;


    @OneToMany(mappedBy = "parent",
        fetch = FetchType.LAZY, cascade = CascadeType.ALL
    )
    private List<ProductCategory> children = new ArrayList<>();

    public ProductCategory(String name) {
        this.name = name;
    }
    public ProductCategory(String name, ProductCategory parent) {
        this.name = name;
        this.parent = parent;
    }
    public ProductCategory(Long id, String name) {
        this.id = id;
        this.name = name;
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

    //public Long getVersion() { return version; }
    //public void setVersion(Long version) {
     //   this.version = version;
    //}

    public void setParent(ProductCategory parent) {
        this.parent = parent;
    }
/*
    public List<ProductCategory> getChildren() {
        return children;
    }

    public void setChildren(List<ProductCategory> children) {
        this.children = children;
    }
*/
    public ProductCategory getParent() {
        return parent;
    }

    public List<ProductCategory> getChildren() {
        return  this.children;
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
                Objects.equals(parent, p.parent);
    }
    @Override
    public int hashCode() {
         return Objects.hash(id,name,parent);
    } //,version

    @Override
    public String toString() {
        String par = "null";
        String _children = "[null]";
        if (this.parent != null) {
            par = String.format("{id=%d,name=%s}",parent.id,parent.name);
        }
        if (this.children.size() > 0) {
            _children = "[";
            for (ProductCategory pc : this.children) {
                _children += "id="+pc.id+",name="+pc.name+";";
            }
            _children += "]";
        }
        String pc = String.format("ProductCategory{id=%d,name=%s,parent=%s,children=%s}", id, name, par, _children);
        return pc;
    }

    public void addChildCategory(ProductCategory pc) {
        children.add(pc);
        pc.setParent(this);
    }
}
