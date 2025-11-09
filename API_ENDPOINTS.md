# API Endpoints for Postman Testing

Base URL: `https://aci-backend.vercel.app`

## Health Check
- **GET** `https://aci-backend.vercel.app/health`
- **Description**: Check if server is running
- **Response**:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Products Endpoints

### 1. Get All Products
- **Method**: `GET`
- **URL**: `https://aci-backend.vercel.app/api/products`
- **Description**: Get all products from database
- **Query Parameters** (optional):
  - `category`: Filter by category (e.g., `?category=Uncategorized`)
- **Example**: `https://aci-backend.vercel.app/api/products?category=Baby`
- **Response**:
```json
{
  "success": true,
  "count": 10,
  "products": [
    {
      "_id": "...",
      "material": 542518,
      "barcode": "8901012116340",
      "description": "Johnson NMT Shampoo Ind 100 ml",
      "category": "Baby",
      "scannedAt": "2025-11-09T04:45:19.314Z",
      "createdAt": "2025-11-09T04:45:19.321Z",
      "updatedAt": "2025-11-09T05:17:53.894Z"
    }
  ]
}
```

### 2. Get Product by Barcode
- **Method**: `GET`
- **URL**: `https://aci-backend.vercel.app/api/products/:barcode`
- **Description**: Get a single product by its barcode
- **Example**: `https://aci-backend.vercel.app/api/products/8901012116340`
- **Response** (Success):
```json
{
  "success": true,
  "product": {
    "_id": "...",
    "material": 542518,
    "barcode": "8901012116340",
    "description": "Johnson NMT Shampoo Ind 100 ml",
    "category": "Baby",
    "scannedAt": "2025-11-09T04:45:19.314Z",
    "createdAt": "2025-11-09T04:45:19.321Z",
    "updatedAt": "2025-11-09T05:17:53.894Z"
  }
}
```
- **Response** (Not Found - 404):
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 3. Save a Product
- **Method**: `POST`
- **URL**: `https://aci-backend.vercel.app/api/products`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "material": 542518,
  "barcode": "8901012116340",
  "description": "Johnson NMT Shampoo Ind 100 ml",
  "category": "Uncategorized"
}
```
- **Response** (Success - 201):
```json
{
  "success": true,
  "message": "Product saved successfully",
  "product": {
    "_id": "...",
    "material": 542518,
    "barcode": "8901012116340",
    "description": "Johnson NMT Shampoo Ind 100 ml",
    "category": "Uncategorized",
    "scannedAt": "2025-11-09T04:45:19.314Z",
    "createdAt": "2025-11-09T04:45:19.321Z",
    "updatedAt": "2025-11-09T04:45:19.321Z"
  }
}
```
- **Response** (Already Exists - 200):
```json
{
  "success": true,
  "message": "Product already exists",
  "product": {
    "_id": "...",
    "material": 542518,
    "barcode": "8901012116340",
    "description": "Johnson NMT Shampoo Ind 100 ml",
    "category": "Uncategorized"
  }
}
```

### 4. Update Product Category
- **Method**: `PATCH`
- **URL**: `https://aci-backend.vercel.app/api/products/:id/category`
- **Description**: Update a product's category (creates category if it doesn't exist)
- **Headers**: 
  - `Content-Type: application/json`
- **Example**: `https://aci-backend.vercel.app/api/products/69101c5f507ff0bf0157fa58/category`
- **Body** (JSON):
```json
{
  "category": "Baby"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Product category updated successfully",
  "product": {
    "_id": "69101c5f507ff0bf0157fa58",
    "material": 542518,
    "barcode": "8901012116340",
    "description": "Johnson NMT Shampoo Ind 100 ml",
    "category": "Baby",
    "updatedAt": "2025-11-09T05:17:53.894Z"
  }
}
```

## Categories Endpoints

### 1. Get All Categories
- **Method**: `GET`
- **URL**: `https://aci-backend.vercel.app/api/categories`
- **Description**: Get all categories (sorted by createdAt)
- **Response**:
```json
{
  "success": true,
  "categories": [
    {
      "name": "Uncategorized",
      "createdAt": "2025-11-09T04:00:00.000Z"
    },
    {
      "name": "Baby",
      "createdAt": "2025-11-09T04:30:00.000Z"
    },
    {
      "name": "Snacks",
      "createdAt": "2025-11-09T05:00:00.000Z"
    }
  ]
}
```

### 2. Create a Category
- **Method**: `POST`
- **URL**: `https://aci-backend.vercel.app/api/categories`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "name": "New Category"
}
```
- **Response** (Success - 201):
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": "New Category"
}
```
- **Response** (Already Exists - 200):
```json
{
  "success": true,
  "message": "Category already exists",
  "category": "New Category"
}
```

### 3. Delete a Category
- **Method**: `DELETE`
- **URL**: `https://aci-backend.vercel.app/api/categories/:name`
- **Description**: Delete a category (cannot delete if it has products or if it's "Uncategorized")
- **Example**: `https://aci-backend.vercel.app/api/categories/New%20Category`
- **Response** (Success):
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```
- **Response** (Error - 400):
```json
{
  "success": false,
  "message": "Cannot delete category with 5 product(s). Move all products first.",
  "productCount": 5
}
```

## Postman Testing Guide

### Quick Test - Health Check
1. **Method**: GET
2. **URL**: `https://aci-backend.vercel.app/health`
3. Should return: `{"status":"OK","message":"Server is running"}`

### Test Get All Products
1. **Method**: GET
2. **URL**: `https://aci-backend.vercel.app/api/products`
3. Should return array of products

### Test Get Products by Category
1. **Method**: GET
2. **URL**: `https://aci-backend.vercel.app/api/products?category=Baby`
3. Should return only products in "Baby" category

### Test Save Product
1. **Method**: POST
2. **URL**: `https://aci-backend.vercel.app/api/products`
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "material": 542518,
  "barcode": "8901012116340",
  "description": "Johnson NMT Shampoo Ind 100 ml",
  "category": "Uncategorized"
}
```

### Test Get Categories
1. **Method**: GET
2. **URL**: `https://aci-backend.vercel.app/api/categories`
3. Should return array of categories

### Test Create Category
1. **Method**: POST
2. **URL**: `https://aci-backend.vercel.app/api/categories`
3. **Headers**: `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "name": "Test Category"
}
```

