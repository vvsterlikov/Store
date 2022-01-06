package org.store.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "PRODUCT_CATEGORY_CLASSIFIER")
public class ProductCategoryClassifier {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String val;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_ID", nullable = true)
    protected  ProductCategoryClassifier parent;

    @OneToMany(mappedBy = "parent",
            fetch = FetchType.LAZY
    )
    protected List<ProductCategoryClassifier> children = new ArrayList<ProductCategoryClassifier>();

    public ProductCategoryClassifier() {}

    public ProductCategoryClassifier(String val)
    {
        this.val = val;
    }
    public ProductCategoryClassifier(String val, ProductCategoryClassifier parent)
    {
        this.val = val;
        this.parent = parent;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public void setVal(String val) {
        this.val = val;
    }
    public Long getId() {
        return id;
    }
    public String getVal() {
        return val;
    }

    public void setParent(ProductCategoryClassifier parent) {
        this.parent = parent;
    }

    public ProductCategoryClassifier getParent() {
        return parent;
    }

}
