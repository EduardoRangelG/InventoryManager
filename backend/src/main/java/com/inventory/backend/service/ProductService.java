package com.inventory.backend.service;

import com.inventory.backend.model.Product;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Product createProduct(Product product);

    Optional<Product> getProductbyId(Integer id);

    Product updateProduct(Integer id, Product productDetails);

    Product markProductOutOfStock(Integer id);

    Product markProductInStock(Integer id, Integer quantity);

    Page<Product> listProducts(String name, String category, Boolean inStock, Pageable pageable);

    void deleteProduct(Integer id);
}
