package com.inventory.backend.config;

import com.inventory.backend.model.Product;
import com.inventory.backend.repository.ProductRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {
    private final ProductRepository productRepository;

    public DataLoader(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.findAll().isEmpty()) {
            productRepository.save(new Product("Laptop Dell XPS 13", "Electronics", new BigDecimal("1500.00"),
                    LocalDate.of(2028, 1, 1), 50));
            productRepository.save(new Product("Smartphone Samsung S22", "Electronics", new BigDecimal("999.50"),
                    LocalDate.of(2027, 6, 30), 120));

            System.out.println("Succesful data insertion.");
        }
    }
}
