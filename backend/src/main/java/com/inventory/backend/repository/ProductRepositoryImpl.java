package com.inventory.backend.repository;

import com.inventory.backend.model.Product;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Repository;

@Repository
public class ProductRepositoryImpl implements ProductRepository {
    private final Map<Integer, Product> products = new ConcurrentHashMap<>();
    private final AtomicInteger idCounter = new AtomicInteger();

    @Override
    public Product save(Product product) {
        if (product.getId() == null) {
            Integer newId = idCounter.incrementAndGet();
            product.setId(newId);
            product.setCreationDate(LocalDate.now());
            product.setUpdateDate(LocalDate.now());
            products.put(newId, product);
        } else {
            if (products.containsKey(product.getId())) {
                Product existingProduct = products.get(product.getId());
                product.setCreationDate(existingProduct.getCreationDate());

                product.setUpdateDate(LocalDate.now());
                products.put(product.getId(), product);
            } else {
                throw new IllegalArgumentException("Product with ID " + product.getId() + " not found");
            }
        }
        return product;
    }

    @Override
    public Optional<Product> findById(Integer id) {
        return Optional.ofNullable(products.get(id));
    }

    @Override
    public List<Product> findAll() {
        return new ArrayList<>(products.values());
    }

    @Override
    public boolean existsById(Integer id) {
        return products.containsKey(id);
    }

    @Override
    public void deleteById(Integer id) {
        products.remove(id);
    }

    @Override
    public void deleteAll() {
        products.clear();
        idCounter.set(0);
    }

}
