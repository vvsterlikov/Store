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
            productCategoryRepository.save(new ProductCategory("Компьютеры", "Computers"));
            productCategoryRepository.save(new ProductCategory("Ноутбуки", "Notebooks"));
            productCategoryRepository.save(new ProductCategory("Системные блоки", "System blocks"));
            productCategoryRepository.save(new ProductCategory("Мыши", "Mouses"));
            productCategoryRepository.save(new ProductCategory("Клавиатуры", "Keyboards"));
            productCategoryRepository.save(new ProductCategory("Периферия", "Periphery"));
            productCategoryRepository.save(new ProductCategory("Принтеры", "Printers"));
            productCategoryRepository.save(new ProductCategory("Видеокарты", "Videocards"));
            productCategoryRepository.save(new ProductCategory("Сканеры", "Scaners"));
            productCategoryRepository.save(new ProductCategory("Жесткие диски", "Harddisks"));

            log.info("Выбираем категории из БД");
            for (ProductCategory pc : productCategoryRepository.findAll()) {
                log.info(pc.toString());
            }
        };
    }
}
