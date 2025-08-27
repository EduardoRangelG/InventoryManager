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
                        productRepository.save(new Product("Wireless Earbuds", "Electronics", new BigDecimal("129.99"),
                                        null, 180));
                        productRepository.save(new Product("Bluetooth Speaker", "Electronics", new BigDecimal("79.50"),
                                        null, 95));
                        productRepository.save(new Product("Leather Wallet", "Clothing", new BigDecimal("45.00"),
                                        null, 120));
                        productRepository.save(new Product("Baseball Cap", "Clothing", new BigDecimal("22.99"),
                                        null, 5));
                        productRepository.save(new Product("Wool Scarf", "Clothing", new BigDecimal("35.75"),
                                        null, 85));
                        productRepository.save(new Product("Dark Chocolate Bar", "Food", new BigDecimal("4.99"),
                                        LocalDate.of(2026, 4, 30), 4));
                        productRepository.save(new Product("Almond Butter Jar", "Food", new BigDecimal("9.25"),
                                        LocalDate.of(2027, 7, 19), 110));
                        productRepository.save(new Product("Samsung Galaxy Tablet", "Electronics",
                                        new BigDecimal("450.00"), null, 70));
                        productRepository.save(new Product("Noise Cancelling Headphones", "Electronics",
                                        new BigDecimal("299.95"), null, 40));
                        productRepository.save(new Product("Gaming Mouse", "Electronics", new BigDecimal("89.99"),
                                        null, 0));
                        productRepository.save(new Product("External SSD 1TB", "Electronics", new BigDecimal("120.00"),
                                        null, 5));
                        productRepository.save(new Product("Running Shorts", "Clothing", new BigDecimal("34.50"),
                                        null, 130));
                        productRepository.save(new Product("Leather Belt", "Clothing", new BigDecimal("39.95"),
                                        null, 100));
                        productRepository.save(new Product("Organic Pasta 500g", "Food", new BigDecimal("3.75"),
                                        LocalDate.of(2026, 9, 15), 11));
                        productRepository.save(new Product("Maple Syrup 250ml", "Food", new BigDecimal("14.99"),
                                        LocalDate.of(2027, 5, 20), 85));
                        productRepository.save(new Product("Mechanical Keyboard", "Electronics",
                                        new BigDecimal("110.25"), null, 65));
                        productRepository.save(new Product("Action Camera", "Electronics", new BigDecimal("230.00"),
                                        null, 45));
                        productRepository.save(new Product("Cotton Socks 3-Pack", "Clothing", new BigDecimal("15.00"),
                                        null, 300));
                        productRepository.save(new Product("Granola Cereal", "Food", new BigDecimal("5.50"),
                                        LocalDate.of(2026, 11, 10), 0));
                        productRepository.save(new Product("Canned Iced Coffee", "Food", new BigDecimal("2.99"),
                                        LocalDate.of(2027, 1, 30), 500));
                        productRepository.save(new Product("Webcam 1080p", "Electronics", new BigDecimal("65.80"),
                                        null, 10));
                        productRepository.save(new Product("Knit Sweater", "Clothing", new BigDecimal("68.00"),
                                        null, 60));
                        productRepository.save(new Product("Swim Trunks", "Clothing", new BigDecimal("42.99"),
                                        null, 110));
                        productRepository.save(new Product("Frozen Berries 400g", "Food", new BigDecimal("8.25"),
                                        LocalDate.of(2025, 12, 1), 140));
                        productRepository.save(new Product("Peanut Butter 1kg", "Food", new BigDecimal("11.49"),
                                        LocalDate.of(2026, 6, 18), 1));
                        productRepository.save(new Product("Fitness Tracker", "Electronics", new BigDecimal("89.00"),
                                        null, 125));

                        System.out.println("Succesful data insertion.");
                }
        }
}
