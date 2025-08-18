package com.inventory.backend.repository;

import com.inventory.backend.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    Product save(Product product);

    Optional<Product> findById(Integer id);

    List<Product> findAll();

    boolean existsById(Integer id);

    void deleteById(Integer id);

    void deleteAll();
}