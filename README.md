# Inventory Manager

A full-stack web application for managing a product inventory with real-time metrics, filtering, and sorting capabilities.

## What it doesn't do

- It uses In-Memory Data Store, so if you shut down or restart the backend server, all your operations or modified data will be lost.

## Features

- **CRUD Operations**: Create, read, update, and delete products
- **Product Attributes**: Name, category, quantity, unit price, and optional expiration date
- **Advanced Filtering**: Filter by name, category, and stock status
- **Multi-column Sorting**: Sort by name, category, price, stock, and expiration date
- **Stock Management**: Mark products as in/out of stock
- **Pagination**: 10 products per page
- **Inventory Metrics**: Overall and category-specific metrics including:
  - Total number of products in stock
  - Total inventory value
  - Average price of in-stock products

## Tech Stack

### Frontend

- **TypeScript**: Type safety
- **React.js**: React Context for state management
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API communication
- **Vitest**: Testing framework
- **CSS**: Styling

### Backend

- **Java**: Backend language
- **Spring Boot**: REST API framework
- **Maven**: Build tool and dependency management
- **Mockito**: Testing with mocks
- **In-Memory Data Store**: ConcurrentHashMap for thread-safe storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Java JDK (v11 or higher)
- Maven (v3.6 or higher)

### Installation & Running

1. **Clone the repository**

   ```bash
   git clone https://github.com/EduardoRangelG/InventoryManager.git

   ```

2. **Run the Backend**

   ```bash
   cd backend
   mvn spring-boot:run

   ```

3. **Run the Frontend**

   ```bash
   cd frontend
   npm install
   npm run start

   ```

4. **Access the application**  
   Open your browser and navigate to `http://localhost:8080`

### Testing

1. **Test the Backend**

   ```bash
   cd backend
   mvn test

   ```

2. **Test the Frontend**
   ```bash
   cd frontend
   npm run tests
   ```

## API Documentation

#### Base URL

`http://localhost:9090/api`

### Endpoints

### 1. GET /products (Get all Products)

Query Parameters:

- **name:** Filter by product name (partial match)
- **categories:** Filter by category (comma-separated)
- **inStock:** Filter by stock status (true/false)
- **sortBy:** Field to sort by (name, category, price, stock, expirationDate)
- **sortOrder:** Sort order (asc/desc)
- **page:** Page number (default: 0)
- **size:** Items per page (default: 10)

**Response:** Paginated list of products

### 2. GET /products/{id} (Get Product by ID)

**Response:** Single product details

### 3. POST /products (Create Product)

**Body:** {
"name": "string" (required),
"category": "string" (required),
"quantity": number (required, min: 0),
"unitPrice": number (required, min: 0),
"expirationDate": "string" (optional, ISO format)
}

**Response:** Created product details

### 4. PUT /products/{id} (Update Product)

**Body:** Same as POST /products

**Response:** Updated product details

### 4. DELETE /products/{id} (Delete Product)

**Response:** 204 No Content

### 5. POST /products/{id}/outofstock (Mark Product as Out of Stock)

**Response:** Updated product details

### 5. PUT /products/{id}/instock (Mark Product as In Stock)

**Response:** Updated product details
