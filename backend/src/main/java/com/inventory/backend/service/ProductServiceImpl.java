package com.inventory.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Order;

import com.inventory.backend.model.Product;
import com.inventory.backend.repository.ProductRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import java.util.Optional;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final Validator validator;

    public ProductServiceImpl(ProductRepository productRepository, Validator validator) {
        this.productRepository = productRepository;
        this.validator = validator;
    }

    @Override
    public Product createProduct(Product product) {
        Set<ConstraintViolation<Product>> violations = validator.validate(product);
        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                    .collect(Collectors.joining("; "));

            throw new IllegalArgumentException("Validation error: " + errorMessage);
        }

        return productRepository.save(product);
    }

    @Override
    public Optional<Product> getProductbyId(Integer id) {
        return productRepository.findById(id);
    }

    @Override
    public Product updateProduct(Integer id, Product productDetails) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));

        existingProduct.setName(productDetails.getName());
        existingProduct.setCategory(productDetails.getCategory());
        existingProduct.setUnitPrice(productDetails.getUnitPrice());
        existingProduct.setExpirationDate(productDetails.getExpirationDate());
        existingProduct.setStock(productDetails.getStock());

        Set<ConstraintViolation<Product>> violations = validator.validate(existingProduct);
        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                    .collect(Collectors.joining("; "));

            throw new IllegalArgumentException("Validation error: " + errorMessage);
        }

        return productRepository.save(existingProduct);
    }

    @Override
    public Product markProductOutOfStock(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));

        product.setStock(0);
        return productRepository.save(product);
    }

    @Override
    public Product markProductInStock(Integer id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Stock quantity must be greater than 0");
        }

        product.setStock(quantity);
        return productRepository.save(product);
    }

    @Override
    public Page<Product> listProducts(String name, String category, Boolean inStock, Pageable pageable) {
        List<Product> allProducts = productRepository.findAll();

        // Filtering Logic
        List<Product> filteredProducts = allProducts.stream().filter(product -> {
            boolean matchesName = (name == null || name.isEmpty())
                    || product.getName().toLowerCase().contains(name.toLowerCase());
            boolean matchesCategory = (category == null || category.isEmpty())
                    || product.getCategory().toLowerCase().contains(category.toLowerCase());
            boolean matchesInStock = (inStock == null) ||
                    (inStock && product.getStock() > 0);
            return matchesName && matchesCategory && matchesInStock;
        }).collect(Collectors.toList());

        // Sorting Logic
        Comparator<Product> comparator = null;
        if (pageable.getSort().isSorted()) {
            Optional<Order> orderOptional = pageable.getSort().stream().findFirst();

            if (orderOptional.isPresent()) {
                Order order = orderOptional.get();

                switch (order.getProperty()) {
                    case "name":
                        comparator = Comparator.comparing(Product::getName);
                        break;
                    case "category":
                        comparator = Comparator.comparing(Product::getCategory);
                        break;
                    case "unitPrice":
                        comparator = Comparator.comparing(Product::getUnitPrice);
                        break;
                    case "stock":
                        comparator = Comparator.comparing(Product::getStock);
                        break;
                    case "expirationDate":
                        comparator = Comparator.comparing(Product::getExpirationDate,
                                Comparator.nullsLast(LocalDate::compareTo));
                        break;
                    default:
                        comparator = Comparator.comparing(Product::getName);
                }

                if (order.isDescending()) {
                    comparator = comparator.reversed();
                }
            }
        } else {
            comparator = null;
        }

        if (comparator != null) {
            filteredProducts.sort(comparator);
        }

        // Pagination Logic
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredProducts.size());

        List<Product> pagedProducts;
        if (start > end) {
            pagedProducts = List.of();
        } else {
            pagedProducts = filteredProducts.subList(start, end);
        }

        return new PageImpl<>(pagedProducts, pageable, filteredProducts.size());
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product with ID " + id + " not found");
        }
        productRepository.deleteById(id);
    }

}
