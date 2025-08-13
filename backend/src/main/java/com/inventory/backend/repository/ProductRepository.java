package com.inventory.backend.repository;

import java.util.List;
import java.util.Optional;

import com.inventory.backend.model.Product;

public interface ProductRepository {
    Product save(Product product);

    Optional<Product> findById(int id);

    List<Product> findAll();

    void deleteById(int id);

    boolean existsById(int id);
}