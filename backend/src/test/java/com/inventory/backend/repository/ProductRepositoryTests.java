package com.inventory.backend.repository;

import com.inventory.backend.model.Product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
public class ProductRepositoryTests {
    @Autowired
    private ProductRepositoryImpl productRepository;

    @BeforeEach
    public void setUp() {
        productRepository.deleteAll();
    }

    @Test
    public void ProductRepository_Save_ReturnsSavedProduct() {
        Product product = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );

        Product savedProduct = productRepository.save(product);

        assertThat(savedProduct).isNotNull();
        assertThat(savedProduct.getId()).isEqualTo(1);
    }

    @Test
    public void ProductRepository_GetAll_ReturnsMoreThanOneProduct() {
        Product product1 = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );
        Product product2 = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );

        productRepository.save(product1);
        productRepository.save(product2);

        List<Product> products = productRepository.findAll();

        assertThat(products).isNotNull();
        assertThat(products.size()).isEqualTo(2);
    }

    @Test
    public void ProductRepository_GetById_ReturnsProduct() {
        Product product = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );

        productRepository.save(product);

        Product savedProduct = productRepository.findById(product.getId()).get();

        assertThat(savedProduct).isNotNull();
    }

    @Test
    public void ProductRepository_UpdateProduct_ReturnsProductNotNull() {
        Product product = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );

        productRepository.save(product);

        Product savedProduct = productRepository.findById(product.getId()).get();
        savedProduct.setName("Rice");
        savedProduct.setCategory("Food");
        savedProduct.setStock(10);

        Product updatedProduct = productRepository.save(savedProduct);

        assertThat(updatedProduct.getName()).isEqualTo("Rice");
        assertThat(updatedProduct.getCategory()).isEqualTo("Food");
        assertThat(updatedProduct.getStock()).isEqualTo(10);
    }

    @Test
    public void ProductRepository_DeleteById_ReturnsProductIsEmpty() {
        Product product = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );

        productRepository.save(product);

        productRepository.deleteById(product.getId());
        Optional<Product> deletedProduct = productRepository.findById(product.getId());

        assertThat(deletedProduct).isEmpty();
    }

    @Test
    public void ProductRepository_ExistsById_ReturnsTrue() {
        Product product = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );

        productRepository.save(product);

        boolean existingProduct = productRepository.existsById(product.getId());

        assertThat(existingProduct).isTrue();
    }
}
