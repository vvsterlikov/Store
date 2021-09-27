package org.store;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.store.domain.ProductCategory;
import org.store.repository.ProductCategoryRepository;

@SpringBootApplication
public class Store {
    public static final Logger log = LoggerFactory.getLogger(Store.class);
    public static void main(String[] args) {
        SpringApplication.run(Store.class, args);
    }
    @Bean
    public CommandLineRunner demo(ProductCategoryRepository productCategoryRepository) {
        return (args) -> {
            productCategoryRepository.save(new ProductCategory("Компьютеры"));
            productCategoryRepository.save(new ProductCategory("Ноутбуки"));

            log.info("Выбираем категории из БД");
            for (ProductCategory pc : productCategoryRepository.findAll()) {
                log.info(pc.toString());
            }
        };
    }
}
