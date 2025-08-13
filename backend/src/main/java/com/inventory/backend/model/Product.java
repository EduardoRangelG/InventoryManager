package com.inventory.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Product {
    private Integer id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Unit Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0.01")
    private BigDecimal unitPrice;

    @FutureOrPresent(message = "Expiration Date can not be in the past")
    private LocalDate expirationDate;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock can not be negative")
    private Integer stock;

    private LocalDate creationDate;

    private LocalDate updateDate;

    public Product(String name, String category, BigDecimal unitPrice, LocalDate expirationDate, Integer stock) {
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.expirationDate = expirationDate;
        this.stock = stock;
        // Timestamps will be set in the repository implementation
        this.creationDate = LocalDate.now();
        this.updateDate = LocalDate.now();
    }
}
