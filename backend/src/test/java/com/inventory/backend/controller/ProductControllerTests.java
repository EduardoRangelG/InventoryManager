package com.inventory.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventory.backend.model.Product;
import com.inventory.backend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerTests {
        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private ProductService productService;

        private Product product;
        private List<Product> productList;

        @BeforeEach
        public void setup() {
                product = new Product(
                                "Product Name",
                                "Category",
                                new BigDecimal("19.99"),
                                LocalDate.now().plusDays(30),
                                100);
                product.setId(1);

                Product product2 = new Product("Laptop", "Electronics", new BigDecimal("1200.00"), null, 5);
                product2.setId(2);

                productList = List.of(product, product2);
        }

        @Test
        public void listProducts_ReturnsPageOfProducts() throws Exception {
                Pageable pageable = PageRequest.of(0, 10, Sort.by("name"));
                Page<Product> productPage = new PageImpl<>(productList, pageable, productList.size());
                when(productService.listProducts(any(), any(), any(), any(Pageable.class))).thenReturn(productPage);

                mockMvc.perform(get("/products").param("page", "0").param("size", "10").param("sort", "name"))
                                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.content.length()", is(2)))
                                .andExpect(jsonPath("$.content[0].name", is("Product Name")))
                                .andExpect(jsonPath("$.content[1].name", is("Laptop")));

                verify(productService, times(1)).listProducts(any(), any(), any(), any(Pageable.class));

        }

        @Test
        public void getProductbyId_ExistingId_ReturnsProduct() throws Exception {
                when(productService.getProductbyId(1)).thenReturn(Optional.of(product));

                mockMvc.perform(get("/products/1")).andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.name", is("Product Name")));

                verify(productService, times(1)).getProductbyId(1);
        }

        @Test
        public void getProductbyId_NonExistingId_ReturnsNotFound() throws Exception {
                when(productService.getProductbyId(-1)).thenReturn(Optional.empty());

                mockMvc.perform(get("/products/-1")).andExpect(status().isNotFound());

                verify(productService, times(1)).getProductbyId(-1);
        }

        @Test
        public void createProduct_ValidProduct_ReturnsCreatedStatus() throws Exception {
                when(productService.createProduct(product)).thenReturn(product);
                String productJson = objectMapper.writeValueAsString(product);

                mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON).content(productJson))
                                .andExpect(status().isCreated()).andExpect(jsonPath("$.id", is(1)))
                                .andExpect(jsonPath("$.name", is("Product Name")));

                verify(productService, times(1)).createProduct(any(Product.class));
        }

        @Test
        public void createProduct_ValidProduct_ReturnsBadRequest() throws Exception {
                when(productService.createProduct(any(Product.class)))
                                .thenThrow(IllegalArgumentException.class);

                Product invalidProduct = new Product(
                                "", "Category", new BigDecimal("19.99"), LocalDate.now(), 100);
                String productJson = objectMapper.writeValueAsString(invalidProduct);

                mockMvc.perform(post("/products").contentType(MediaType.APPLICATION_JSON).content(productJson))
                                .andExpect(status().isBadRequest());

                verify(productService, never()).createProduct(any(Product.class));
        }

        @Test
        public void updateProduct_ValidDetails_ReturnsOkStatus() throws Exception {
                Product updatedProduct = new Product("Updated Product", "Updated Category",
                                new BigDecimal("25.00"), LocalDate.now().plusDays(60), 150);
                when(productService.updateProduct(eq(1), any(Product.class))).thenReturn(updatedProduct);
                String updatedProductJson = objectMapper.writeValueAsString(updatedProduct);

                mockMvc.perform(put("/products/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(updatedProductJson))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name", is("Updated Product")));

                verify(productService, times(1)).updateProduct(eq(1), any(Product.class));
        }

        @Test
        public void updateProduct_NonExistingId_ReturnsBadRequest() throws Exception {
                when(productService.updateProduct(eq(-1), any(Product.class)))
                                .thenThrow(IllegalArgumentException.class);
                String productJson = objectMapper.writeValueAsString(product);

                mockMvc.perform(put("/products/-1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(productJson))
                                .andExpect(status().isBadRequest());

                verify(productService, times(1)).updateProduct(eq(-1), any(Product.class));
        }

        @Test
        public void deleteProduct_ExistingId_ReturnsNoContent() throws Exception {
                doNothing().when(productService).deleteProduct(1);

                mockMvc.perform(delete("/products/1"))
                                .andExpect(status().isNoContent());

                verify(productService, times(1)).deleteProduct(1);
        }

        @Test
        public void deleteProduct_NonExistingId_ReturnsBadRequest() throws Exception {
                doThrow(IllegalArgumentException.class).when(productService).deleteProduct(-1);

                mockMvc.perform(delete("/products/-1"))
                                .andExpect(status().isBadRequest());

                verify(productService, times(1)).deleteProduct(-1);
        }

        @Test
        public void markProductOutOfStock_ExistingId_ReturnsOkStatus() throws Exception {
                Product outOfStockProduct = new Product(product.getName(), product.getCategory(),
                                product.getUnitPrice(), product.getExpirationDate(), 0);
                when(productService.markProductOutOfStock(1)).thenReturn(outOfStockProduct);

                mockMvc.perform(post("/products/1/outofstock"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.stock", is(0)));

                verify(productService, times(1)).markProductOutOfStock(1);
        }

        @Test
        public void markProductInStock_ValidQuantity_ReturnsOkStatus() throws Exception {
                int newQuantity = 200;
                Product inStockProduct = new Product(product.getName(), product.getCategory(),
                                product.getUnitPrice(), product.getExpirationDate(), newQuantity);
                when(productService.markProductInStock(1, newQuantity)).thenReturn(inStockProduct);

                mockMvc.perform(put("/products/1/instock")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(newQuantity)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.stock", is(newQuantity)));

                verify(productService, times(1)).markProductInStock(1, newQuantity);
        }

        @Test
        public void markProductInStock_InvalidQuantity_ReturnsBadRequest() throws Exception {
                when(productService.markProductInStock(eq(1), any()))
                                .thenThrow(IllegalArgumentException.class);

                mockMvc.perform(put("/products/1/instock")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(-10)))
                                .andExpect(status().isBadRequest());

                verify(productService, times(1)).markProductInStock(eq(1), any());
        }
}
