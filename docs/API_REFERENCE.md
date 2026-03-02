# DesignInn API Documentation
## Base URL: `http://localhost:8000/api/v1`

---

## Authentication

### Token Authentication
All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Token your_token_here
```

### Register & Get Token
```http
POST /users/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123",
  "phone": "+1234567890",
  "first_name": "John",
  "last_name": "Doe"
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "token": "abc123xyz789",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

---

## Users Endpoints

### List Users (Admin)
```http
GET /users/
Authorization: Token admin_token

Response (200):
{
  "count": 50,
  "next": "http://localhost:8000/api/v1/users/?page=2",
  "previous": null,
  "results": [...]
}
```

### Get Current User Profile
```http
GET /users/me/
Authorization: Token user_token

Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "company_name": "MyCompany",
    "avatar": "https://cloudinary.url/avatar.jpg",
    "is_verified": true,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Update Profile
```http
PUT /users/me/
Authorization: Token user_token
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+1234567890",
  "company_name": "NewCompany",
  "address": "123 Main St",
  "city": "New York",
  "avatar": "base64_or_file"
}

Response (200): Updated user data
```

### Change Password
```http
POST /users/change_password/
Authorization: Token user_token
Content-Type: application/json

{
  "old_password": "oldpass123",
  "new_password": "newpass123",
  "confirm_password": "newpass123"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Verify Token
```http
POST /users/verify_token/
Authorization: Token user_token

Response (200):
{
  "success": true,
  "user": { user_data }
}
```

### Logout
```http
POST /users/logout/
Authorization: Token user_token

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Products Endpoints

### List Products
```http
GET /products/?search=shirt&category=1&ordering=-created_at&page=1

Query Parameters:
- search: Search in name, description
- category: Filter by category ID
- status: draft, active, inactive, discontinued
- ordering: -created_at, -price, name, etc.
- page_size: Override default 12

Response (200):
{
  "count": 150,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Premium T-Shirt",
      "slug": "premium-t-shirt",
      "description": "High quality t-shirt",
      "price": 29.99,
      "compare_price": 49.99,
      "discount_percentage": 40,
      "sku": "TSHIRT-001",
      "stock": 150,
      "is_customizable": true,
      "is_featured": true,
      "status": "active",
      "variants": [
        {
          "id": 1,
          "name": "Size S",
          "sku": "TSHIRT-001-S",
          "price": 29.99,
          "stock": 50,
          "is_in_stock": true
        }
      ],
      "images": [
        {
          "id": 1,
          "image": "https://cloudinary.url/product.jpg",
          "alt_text": "Front view"
        }
      ]
    }
  ]
}
```

### Get Product Details
```http
GET /products/premium-t-shirt/

Response (200): Single product object
```

### Featured Products
```http
GET /products/featured/

Response (200): Paginated featured products
```

### Newest Products
```http
GET /products/newest/

Response (200): Paginated newest products
```

### Best Sellers
```http
GET /products/bestsellers/

Response (200): Paginated best selling products
```

### Related Products
```http
GET /products/premium-t-shirt/related/

Response (200): Products in same category
```

### Create Product (Admin)
```http
POST /products/
Authorization: Token admin_token
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 49.99,
  "compare_price": 79.99,
  "cost": 20.00,
  "sku": "PROD-001",
  "category": 1,
  "is_customizable": true,
  "status": "draft",
  "tags": ["new", "popular"]
}

Response (201): Created product
```

### Update Product (Admin)
```http
PUT /products/premium-t-shirt/
Authorization: Token admin_token
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 39.99,
  "status": "active"
}

Response (200): Updated product
```

### Toggle Featured (Admin)
```http
POST /products/premium-t-shirt/toggle_featured/
Authorization: Token admin_token

Response (200): { "is_featured": true/false }
```

### Toggle Status (Admin)
```http
POST /products/premium-t-shirt/toggle_status/
Authorization: Token admin_token
Content-Type: application/json

{
  "status": "active"  # draft, active, inactive, discontinued
}

Response (200): Updated product
```

### Adjust Variant Stock (Admin)
```http
POST /products/variants/1/adjust_stock/
Authorization: Token admin_token
Content-Type: application/json

{
  "quantity": 10  # Positive to add, negative to reduce
}

Response (200): Updated variant
```

### List Categories
```http
GET /products/categories/

Response (200):
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "T-Shirts",
      "icon": "shirt",
      "order": 1,
      "is_active": true
    }
  ]
}
```

---

## Orders Endpoints

### Create Order
```http
POST /orders/
Authorization: Token user_token
Content-Type: application/json

{
  "items": [
    {
      "product": 1,
      "quantity": 2,
      "variant": 1,
      "design_file": "base64_or_file",
      "special_instructions": "Add custom text"
    }
  ],
  "discount_amount": 5.00,
  "tax_percentage": 10,
  "delivery_type": "home_delivery",  # local_pickup, home_delivery, express
  "delivery_fee": 5.00,
  "shipping_address": "123 Main St, New York, NY 10001"
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-2024-001",
    "status": "pending",
    "subtotal": 99.98,
    "discount_amount": 5.00,
    "tax": 9.50,
    "delivery_fee": 5.00,
    "total": 109.48,
    "items": [...],
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### List My Orders
```http
GET /orders/my_orders/?status=pending&ordering=-created_at
Authorization: Token user_token

Query Parameters:
- status: pending, confirmed, processing, ready, shipped, delivered, cancelled
- ordering: -created_at, status, total
- page: Pagination

Response (200): Paginated user's orders
```

### Get Order Details
```http
GET /orders/1/
Authorization: Token user_token

Response (200):
{
  "id": 1,
  "order_number": "ORD-2024-001",
  "status": "processing",
  "items": [
    {
      "id": 1,
      "product": { product_data },
      "quantity": 2,
      "unit_price": 49.99,
      "total": 99.98,
      "variant": { variant_data },
      "design_file": "https://cloudinary.url/design.pdf"
    }
  ],
  "status_logs": [
    {
      "status": "pending",
      "changed_at": "2024-01-15T10:30:00Z",
      "changed_by": { user_data },
      "notes": "Payment verified"
    }
  ],
  "subtotal": 99.98,
  "total": 109.48,
  "tracking_number": "TRACK123",
  "expected_delivery": "2024-01-20",
  "feedback": null
}
```

### Track Order
```http
GET /orders/1/track/
Authorization: Token user_token (or public)

Response (200):
{
  "order_number": "ORD-2024-001",
  "status": "shipped",
  "status_timeline": [
    {
      "status": "pending",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "status": "confirmed",
      "timestamp": "2024-01-15T11:00:00Z"
    },
    {
      "status": "processing",
      "timestamp": "2024-01-15T14:00:00Z"
    },
    {
      "status": "ready",
      "timestamp": "2024-01-16T09:00:00Z"
    },
    {
      "status": "shipped",
      "timestamp": "2024-01-16T15:00:00Z",
      "tracking_number": "TRACK123"
    }
  ]
}
```

### Cancel Order
```http
POST /orders/1/cancel/
Authorization: Token user_token
Content-Type: application/json

{
  "reason": "Changed my mind"
}

Response (200):
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

### Update Order Status (Admin)
```http
POST /orders/1/update_status/
Authorization: Token admin_token
Content-Type: application/json

{
  "status": "processing",  # Next status in workflow
  "notes": "Payment confirmed, starting production"
}

Response (200): Updated order with new status log
```

### Mark as Shipped (Admin)
```http
POST /orders/1/mark_shipped/
Authorization: Token admin_token
Content-Type: application/json

{
  "tracking_number": "TRACK123",
  "notes": "Shipped via UPS"
}

Response (200): Order marked as shipped
```

### Add Order Feedback
```http
POST /orders/1/feedback/
Authorization: Token user_token
Content-Type: application/json

{
  "rating": 5,
  "would_recommend": true,
  "comment": "Great quality and fast delivery!"
}

Response (201): Feedback created
```

### Get Order Summary (Admin)
```http
GET /orders/1/summary/
Authorization: Token admin_token

Response (200):
{
  "order_number": "ORD-2024-001",
  "customer": { user_data },
  "items_count": 2,
  "total_items": 5,  # Sum of quantities
  "financial_summary": {
    "subtotal": 99.98,
    "discount": 5.00,
    "tax": 9.50,
    "delivery": 5.00,
    "total": 109.48
  },
  "status": "shipped",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Quotes Endpoints

### Submit Quote Request
```http
POST /quotes/
Authorization: Token user_token
Content-Type: application/json

{
  "service_type": "logo_design",  # 9 types available
  "title": "Company Logo Design",
  "description": "Need modern logo redesign",
  "budget_min": 500,
  "budget_max": 2000,
  "attachment": "base64_or_file",
  "priority": "medium"  # low, medium, high, urgent
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "quote_number": "QT-2024-0001",
    "service_type": "logo_design",
    "title": "Company Logo Design",
    "status": "submitted",
    "priority": "medium",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### List My Quotes
```http
GET /quotes/my_quotes/?status=pending&ordering=-created_at
Authorization: Token user_token

Query Parameters:
- status: submitted, pending_review, quoted, accepted, rejected, completed
- ordering: -created_at, priority, budget_max
- page: Pagination

Response (200): Paginated user's quotes
```

### Get Quote Details
```http
GET /quotes/1/
Authorization: Token user_token

Response (200):
{
  "id": 1,
  "quote_number": "QT-2024-0001",
  "customer": { user_data },
  "service_type": "logo_design",
  "title": "Company Logo Design",
  "description": "...",
  "budget_min": 500,
  "budget_max": 2000,
  "quoted_amount": 1500,
  "status": "quoted",
  "priority": "medium",
  "reviewed_by": { admin_data },
  "reviewed_at": "2024-01-15T12:00:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "comments": [
    {
      "id": 1,
      "author": { user_data },
      "message": "Can we see some draft concepts?",
      "is_admin": false,
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### Add Comment to Quote
```http
POST /quotes/1/add_comment/
Authorization: Token user_token
Content-Type: application/json

{
  "message": "Thank you! Can we discuss timelines?"
}

Response (201): Comment created
```

### Update Quote Status (Admin)
```http
POST /quotes/1/update_status/
Authorization: Token admin_token
Content-Type: application/json

{
  "status": "quoted",  # Next status
  "quoted_amount": 1500,
  "notes": "Based on scope discussion"
}

Response (200): Quote updated with new status
```

### Accept Quote
```http
POST /quotes/1/accept/
Authorization: Token user_token
Content-Type: application/json

{
  "message": "Looks great! Ready to proceed."
}

Response (200): Quote status changed to accepted
```

### Reject Quote
```http
POST /quotes/1/reject/
Authorization: Token user_token
Content-Type: application/json

{
  "reason": "Budget exceeds our limit",
  "message": "Thank you for the quote"
}

Response (200): Quote status changed to rejected
```

### Pending Review Quotes (Admin)
```http
GET /quotes/pending_review/?priority=high
Authorization: Token admin_token

Response (200): Quotes awaiting admin review
```

---

## Portfolio Endpoints

### List Published Projects
```http
GET /portfolio/?category=web_design&ordering=-created_at

Query Parameters:
- category: 9 categories available
- ordering: -created_at, -views, name
- search: Search in title, description
- page: Pagination

Response (200):
{
  "count": 45,
  "results": [
    {
      "id": 1,
      "title": "E-Commerce Platform",
      "slug": "e-commerce-platform",
      "description": "Custom e-commerce solution",
      "category": "web_design",
      "featured_image": "https://cloudinary.url/project.jpg",
      "featured": true,
      "views": 1534,
      "status": "published",
      "images": [
        {
          "id": 1,
          "image": "https://cloudinary.url/project-1.jpg",
          "caption": "Homepage design"
        }
      ],
      "created_at": "2024-01-10T10:30:00Z"
    }
  ]
}
```

### Featured Projects
```http
GET /portfolio/featured/

Response (200): Paginated featured projects only
```

### Projects by Category
```http
GET /portfolio/by_category/?category=web_design

Response (200): Paginated projects in category
```

### Latest Projects
```http
GET /portfolio/latest/?limit=6

Response (200): 6 most recent projects
```

### Get Project Details
```http
GET /portfolio/e-commerce-platform/

# Automatically increments view counter

Response (200): Project with all images and metadata
```

### Create Project (Admin)
```http
POST /portfolio/
Authorization: Token admin_token
Content-Type: application/json

{
  "title": "New Project",
  "description": "Long description",
  "category": "web_design",  # 9 categories
  "featured_image": "base64_or_file",
  "featured": true,
  "status": "draft"  # draft, published, archived
}

Response (201): Created project
```

### Update Project (Admin)
```http
PUT /portfolio/e-commerce-platform/
Authorization: Token admin_token
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published",
  "featured": false
}

Response (200): Updated project
```

### Delete Project (Admin)
```http
DELETE /portfolio/e-commerce-platform/
Authorization: Token admin_token

Response (204): Project deleted
```

---

## Services Endpoints

### List Services
```http
GET /services/?type=web_development&ordering=-price

Query Parameters:
- type: 12 service types available
- status: active, inactive
- ordering: -created_at, price, name
- page: Pagination

Response (200):
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "name": "Website Design",
      "slug": "website-design",
      "description": "Professional website design",
      "service_type": "web_design",
      "price": 2999.99,
      "revision_rounds": 3,
      "delivery_time": "14 days",
      "features": [
        "Responsive design",
        "3 page design",
        "CMS integration",
        "SEO optimization"
      ],
      "featured": true,
      "status": "active",
      "created_at": "2024-01-01T10:30:00Z"
    }
  ]
}
```

### Featured Services
```http
GET /services/featured/

Response (200): Paginated featured services only
```

### Services by Type
```http
GET /services/by_type/?type=web_development

Response (200): Services filtered by type
```

### All Service Types
```http
GET /services/all_types/

Response (200):
{
  "results": [
    {
      "type": "web_design",
      "count": 5,
      "label": "Web Design"
    },
    {
      "type": "app_development",
      "count": 3,
      "label": "App Development"
    }
  ]
}
```

### Get Service Details
```http
GET /services/website-design/

Response (200): Single service with all details
```

### Create Service (Admin)
```http
POST /services/
Authorization: Token admin_token
Content-Type: application/json

{
  "name": "New Service",
  "description": "Service description",
  "service_type": "web_design",  # 12 types
  "price": 2999.99,
  "revision_rounds": 3,
  "delivery_time": "14 days",
  "features": ["Feature 1", "Feature 2"],
  "featured": true,
  "status": "active"
}

Response (201): Created service
```

### Update Service (Admin)
```http
PUT /services/website-design/
Authorization: Token admin_token
Content-Type: application/json

{
  "price": 3299.99,
  "featured": false
}

Response (200): Updated service
```

### Delete Service (Admin)
```http
DELETE /services/website-design/
Authorization: Token admin_token

Response (204): Service deleted
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input",
  "status_code": 400,
  "details": {
    "email": ["This field may not be blank."],
    "phone": ["Phone number must be valid"]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "status_code": 401,
  "details": "Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Permission denied",
  "status_code": 403,
  "details": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "status_code": 404,
  "details": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server error",
  "status_code": 500,
  "details": "An unexpected error occurred"
}
```

---

## Pagination

All list endpoints support pagination with 12 items per page by default:

```
?page=1&page_size=25
```

Response includes:
- `count`: Total number of items
- `next`: URL to next page
- `previous`: URL to previous page
- `results`: Array of items

---

## Filtering & Search

### Available Filters
- `search`: Full-text search on applicable fields
- `status`: Filter by status
- `category`: Filter by category ID
- `type`: Filter by type field
- `ordering`: Sort results

### Example
```
GET /products/?search=shirt&category=1&status=active&ordering=-price
```

---

## Rate Limiting

Currently unlimited. Production implementation should add:
- Per user: 1000 requests/hour
- Per IP: 5000 requests/hour

---

## CORS Headers

All endpoints include CORS headers allowing frontend integration from configured origins.

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Request successful, no response body |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Unexpected error |

---

## Next Steps

1. **Run Migrations**: `python manage.py migrate`
2. **Create Superuser**: `python manage.py createsuperuser`
3. **Start Server**: `python manage.py runserver`
4. **Visit Admin**: http://localhost:8000/admin/
5. **Test API**: Use endpoints above with Postman or similar tool

For questions or issues, refer to the detailed docstrings in the source code.