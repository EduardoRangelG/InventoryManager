package com.inventory.backend.service;

import com.inventory.backend.model.Product;
import com.inventory.backend.repository.ProductRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTests {
    @Mock
    private ProductRepository productRepository;

    @Mock
    private Validator validator;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private List<Product> productList;

    @BeforeEach
    public void setUp() {
        product = new Product(
                "Product Name", // name (String)
                "Category", // category (String)
                new BigDecimal("19.99"), // unitPrice (BigDecimal)
                LocalDate.now().plusDays(30), // expirationDate (LocalDate)
                100 // stock (Integer)
        );
        product.setId(1);
        product.setCreationDate(LocalDate.now());

        Product product2 = new Product("Rice", "Food", new BigDecimal("5.00"), null, 50);
        product2.setId(2);
        Product product3 = new Product("Laptop", "Electronics", new BigDecimal("1200.00"), null, 0);
        product3.setId(3);

        productList = Arrays.asList(product, product2, product3);
    }

    @Test
    public void createProduct_ValidProduct_ReturnsSavedProduct() {
        when(validator.validate(any(Product.class))).thenReturn(Collections.emptySet());
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product savedProduct = productService.createProduct(product);

        assertThat(savedProduct).isNotNull();
        assertThat(savedProduct.getId()).isEqualTo(1);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    public void createProduct_InvalidProduct_ThrowsException() {
        Set<ConstraintViolation<Product>> violations = new HashSet<>();
        violations.add(mock(ConstraintViolation.class));
        when(validator.validate(any(Product.class))).thenReturn(violations);

        assertThatThrownBy(() -> productService.createProduct(product)).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Validation error");

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    public void getProductbyId_ExistingId_ReturnsProduct() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        Optional<Product> foundProduct = productService.getProductbyId(1);

        assertThat(foundProduct).isPresent();
        assertThat(foundProduct.get().getId()).isEqualTo(1);
        verify(productRepository, times(1)).findById(1);
    }

    @Test
    public void getProductbyId_NonExistingId_ReturnsEmptyOptional() {
        when(productRepository.findById(-1)).thenReturn(Optional.empty());

        Optional<Product> foundProduct = productService.getProductbyId(-1);

        assertThat(foundProduct).isEmpty();
        verify(productRepository, times(1)).findById(-1);
    }

    @Test
    public void updateProduct_ExistingProduct_ReturnsUpdatedProduct() {
        Product updatedDetails = new Product("Updated Name", "Updated Category",
                new BigDecimal("25.00"), LocalDate.now().plusDays(60), 150);

        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(validator.validate(any(Product.class))).thenReturn(Collections.emptySet());
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.updateProduct(1, updatedDetails);

        assertThat(result.getName()).isEqualTo("Updated Name");
        assertThat(result.getCategory()).isEqualTo("Updated Category");
        assertThat(result.getUnitPrice()).isEqualTo(new BigDecimal("25.00"));
        assertThat(result.getExpirationDate()).isEqualTo(LocalDate.now().plusDays(60));
        assertThat(result.getStock()).isEqualTo(150);
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    public void updateProduct_NonExistingProduct_ThrowsException() {
        Product updatedDetails = new Product("Updated Name", "Updated Category",
                new BigDecimal("25.00"), LocalDate.now().plusDays(60), 150);

        when(productRepository.findById(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.updateProduct(999, updatedDetails))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product with ID 999 not found");
        verify(productRepository, times(1)).findById(999);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    public void markProductOutOfStock_ExistingProduct_SetStockToZero() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.markProductOutOfStock(1);

        assertThat(result.getStock()).isEqualTo(0);
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    public void markProductInStock_ExistingProduct_SetStockGivenQuantity() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.markProductInStock(1, 10);

        assertThat(result.getStock()).isEqualTo(10);
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    public void markProductInStock_InvalidQuantity_ThrowsException() {
        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> productService.markProductInStock(1, -1)).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Stock quantity must be greater than 0");

        verify(productRepository, times(1)).findById(1);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    public void listProducts_NoFilters_ReturnsAllProductsPaginatedAndSortedByName() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("name"));
        when(productRepository.findAll()).thenReturn(productList);

        Page<Product> result = productService.listProducts(null, null, null, pageable);

        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Laptop");
        assertThat(result.getContent().get(1).getName()).isEqualTo("Product Name");
        assertThat(result.getContent().get(2).getName()).isEqualTo("Rice");
        assertThat(result.getTotalElements()).isEqualTo(3);
        verify(productRepository, times(1)).findAll();
    }

    @Test
    public void listProducts_FilterByName_ReturnsFilteredProducts() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("name"));
        when(productRepository.findAll()).thenReturn(productList);

        Page<Product> result = productService.listProducts("rice", null, null, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).isEqualTo("Rice");
        verify(productRepository, times(1)).findAll();
    }

    @Test
    public void listProducts_FilterByInStock_ReturnsOnlyInStockProducts() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("name"));
        when(productRepository.findAll()).thenReturn(productList);

        Page<Product> result = productService.listProducts(null, null, true, pageable);

        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().stream().map(Product::getName))
                .containsExactlyInAnyOrder("Product Name", "Rice");
        verify(productRepository, times(1)).findAll();
    }

    @Test
    public void deleteProduct_ExistingId_DeletesProduct() {
        when(productRepository.existsById(1)).thenReturn(true);
        doNothing().when(productRepository).deleteById(1);

        productService.deleteProduct(1);

        verify(productRepository, times(1)).existsById(1);
        verify(productRepository, times(1)).deleteById(1);
    }

    @Test
    public void deleteProduct_NonExistingId_ThrowsException() {
        when(productRepository.existsById(999)).thenReturn(false);

        assertThatThrownBy(() -> productService.deleteProduct(999)).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product with ID 999 not found");

        verify(productRepository, times(1)).existsById(999);
        verify(productRepository, never()).deleteById(anyInt());
    }
}
