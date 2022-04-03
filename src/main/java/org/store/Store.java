package org.store;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.store.domain.ProductCategory;
import org.store.dao.ProductCategoryDAO;

@SpringBootApplication
public class Store {
    public static final Logger log = LoggerFactory.getLogger(Store.class);
    public static void main(String[] args) {
        SpringApplication.run(Store.class, args);
    }

    //@Bean
    public CommandLineRunner demo(ProductCategoryDAO productCategoryRepository) {
        return (args) -> {
            productCategoryRepository.save(new ProductCategory("Компьютеры"));
            productCategoryRepository.save(new ProductCategory("Ноутбуки"));
            productCategoryRepository.save(new ProductCategory("Системные блоки"));
            productCategoryRepository.save(new ProductCategory("Мыши"));
            productCategoryRepository.save(new ProductCategory("Клавиатуры"));
            productCategoryRepository.save(new ProductCategory("Периферия"));
            productCategoryRepository.save(new ProductCategory("Принтеры"));
            productCategoryRepository.save(new ProductCategory("Видеокарты"));
            productCategoryRepository.save(new ProductCategory("Сканеры"));
            productCategoryRepository.save(new ProductCategory("Жесткие диски"));
            /*
            log.info("Выбираем категории из БД");
            for (ProductCategory pc : productCategoryRepository.findAll()) {
                log.info(pc.toString());
            }

             */

            //ProductCategoryClassifier pc1 = new ProductCategoryClassifier("Категория1");
            //ProductCategoryClassifier pc2 = new ProductCategoryClassifier("Категория2");
            //prcr.save(new ProductCategoryClassifier("Категория1"));
            //prcr.save(new ProductCategoryClassifier("Категория2"));

            //prcr.save(pc1);
            //prcr.save(pc2);

            //prcr.save(new ProductCategoryClassifier("Дочернее1",pc1));
            //prcr.save(new ProductCategoryClassifier("Дочернее2",pc1));
        };

    }

}
