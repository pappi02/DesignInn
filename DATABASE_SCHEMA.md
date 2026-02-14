# DesignInn Database Schema

## Overview
The DesignInn database uses PostgreSQL with 14 models across 7 Django applications. All models extend a `TimestampedModel` base class providing automatic `created_at` and `updated_at` timestamps.

---

## Users App

### User Model
Extended Django AbstractUser for authentication and profile management.

```
Table: auth_user (+ custom fields)

Fields:
  id                 INT PRIMARY KEY
  password           VARCHAR(128)
  last_login         DATETIME (nullable)
  is_superuser       BOOLEAN DEFAULT False
  username           VARCHAR(150) UNIQUE
  first_name         VARCHAR(150)
  last_name          VARCHAR(150)
  email              VARCHAR(254) UNIQUE
  is_staff           BOOLEAN DEFAULT False
  is_active          BOOLEAN DEFAULT True
  date_joined        DATETIME
  phone              VARCHAR(20) UNIQUE (custom)
  company_name       VARCHAR(255) (custom)
  address            VARCHAR(255) (custom)
  city               VARCHAR(100) (custom)
  avatar             ImageField (Cloudinary) (custom)
  is_verified        BOOLEAN DEFAULT False (custom)
  created_at         DATETIME AUTO (custom)
  updated_at         DATETIME AUTO (custom)

Indexes:
  - email (unique)
  - phone (unique)
  - username (unique)
  - created_at (for sorting)

Relationships:
  - authtoken_token.user (One-to-One: Token on user deletion)
```

---

## Products App

### Category Model
Product categories for organization and filtering.

```
Table: products_category

Fields:
  id                 INT PRIMARY KEY
  name               VARCHAR(200) UNIQUE
  description        TEXT
  icon               VARCHAR(100) (e.g., 'shirt', 'mug')
  order              INT DEFAULT 0 (display order)
  is_active          BOOLEAN DEFAULT True
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - name (unique)
  - order (for display sorting)
  - is_active (for filtering)

Constraints:
  - name must be unique
```

### Product Model
Main merchandise products in the catalog.

```
Table: products_product

Fields:
  id                 INT PRIMARY KEY
  slug               VARCHAR(255) UNIQUE
  name               VARCHAR(255)
  description        TEXT
  category_id        INT FK -> products_category
  price              DECIMAL(10,2)
  compare_price      DECIMAL(10,2) (nullable)
  cost               DECIMAL(10,2) (nullable, for profit calculation)
  sku                VARCHAR(100) UNIQUE NULLABLE
  stock              INT DEFAULT 0 (denormalized from variants)
  is_customizable    BOOLEAN DEFAULT False
  tags               JSON (list of strings)
  status             VARCHAR(20) IN (draft, active, inactive, discontinued)
  is_featured        BOOLEAN DEFAULT False
  seo_title          VARCHAR(255) (nullable)
  seo_description    VARCHAR(255) (nullable)
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - slug (unique)
  - category_id
  - status
  - is_featured
  - created_at (for sorting)
  - sku (for inventory)

Constraints:
  - category must exist
  - price >= 0
  - price >= cost
  - slug must be unique
  - status IN enum
```

### ProductVariant Model
Variants (sizes, colors, etc.) of products with individual pricing and stock.

```
Table: products_productvari ant

Fields:
  id                 INT PRIMARY KEY
  product_id         INT FK -> products_product (CASCADE delete)
  name               VARCHAR(100) (e.g., 'Size M', 'Color Blue')
  sku                VARCHAR(100) UNIQUE NULLABLE
  price_modifier     DECIMAL(10,2) DEFAULT 0 (added to product price)
  stock              INT DEFAULT 0
  image              ImageField (Cloudinary, nullable)
  is_active          BOOLEAN DEFAULT True
  order              INT DEFAULT 0
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - product_id
  - sku (unique, nullable)
  - is_active
  - created_at

Constraints:
  - product must exist
  - sku must be unique if provided
  - price_modifier >= 0
```

### ProductImage Model
Gallery images for products with ordering and accessibility.

```
Table: products_productimage

Fields:
  id                 INT PRIMARY KEY
  product_id         INT FK -> products_product (CASCADE delete)
  image              ImageField (Cloudinary)
  alt_text           VARCHAR(255) (for accessibility)
  order              INT DEFAULT 0 (display order)
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - product_id
  - order (for gallery ordering)

Constraints:
  - product must exist
  - image required
```

---

## Orders App

### Order Model
Customer orders with lifecycle management and financial tracking.

```
Table: orders_order

Fields:
  id                 INT PRIMARY KEY
  user_id            INT FK -> auth_user (SET_NULL on deletion, nullable)
  order_number       VARCHAR(50) UNIQUE AUTO-GENERATED (e.g., 'ORD-2024-00001')
  status             VARCHAR(20) IN (pending, confirmed, processing, ready, shipped, delivered, cancelled)
  subtotal           DECIMAL(10,2) AUTO-CALCULATED (sum of item totals)
  discount_amount    DECIMAL(10,2) DEFAULT 0
  tax_amount         DECIMAL(10,2) DEFAULT 0
  delivery_fee       DECIMAL(10,2) DEFAULT 0
  total              DECIMAL(10,2) AUTO-CALCULATED (subtotal - discount + tax + delivery_fee)
  delivery_type      VARCHAR(20) IN (local_pickup, home_delivery, express)
  shipping_address   TEXT
  tracking_number    VARCHAR(100) NULLABLE
  expected_delivery  DATE NULLABLE
  notes              TEXT NULLABLE
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - user_id
  - order_number (unique)
  - status
  - created_at (for sorting)

Methods:
  - mark_as_shipped(tracking_number)
  - cancel_order()
  - calculate_total() -> Returns subtotal - discount + tax + delivery
  - get_status_display()

Constraints:
  - order_number must be unique
  - status IN enum
  - total >= 0
```

### OrderItem Model
Individual items within an order with customization support.

```
Table: orders_orderitem

Fields:
  id                 INT PRIMARY KEY
  order_id           INT FK -> orders_order (CASCADE delete)
  product_id         INT FK -> products_product
  variant_id         INT FK -> products_productvari ant NULLABLE
  quantity           INT > 0
  unit_price         DECIMAL(10,2) (historical price at purchase)
  total              DECIMAL(10,2) (quantity * unit_price)
  design_file        FileField (Cloudinary) NULLABLE
  special_instructions TEXT NULLABLE (customization details)
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - order_id
  - product_id
  - variant_id (nullable)
  - created_at

Constraints:
  - order must exist
  - product must exist
  - quantity > 0
  - unit_price >= 0
  - variant (if provided) must belong to product
```

### OrderStatusLog Model
Audit trail of order status changes with user tracking.

```
Table: orders_orderstatuslog

Fields:
  id                 INT PRIMARY KEY
  order_id           INT FK -> orders_order (CASCADE delete)
  status             VARCHAR(20) IN (valid statuses)
  changed_by_id      INT FK -> auth_user (SET_NULL on deletion, admin only)
  notes              TEXT NULLABLE (reason for change)
  created_at         DATETIME AUTO (read-only)

Indexes:
  - order_id
  - status
  - created_at

Constraints:
  - order must exist
  - status must be valid
  - Auto-created on status change
```

### OrderFeedback Model
Customer feedback and ratings on completed orders.

```
Table: orders_orderfeedback

Fields:
  id                 INT PRIMARY KEY
  order_id           INT FK -> orders_order (UNIQUE, CASCADE delete)
  rating             INT IN (1, 2, 3, 4, 5)
  would_recommend    BOOLEAN DEFAULT True
  comment            TEXT NULLABLE
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - order_id (unique)
  - rating

Constraints:
  - order must exist
  - One feedback per order
  - rating IN [1, 2, 3, 4, 5]
```

---

## Quotes App

### Quote Model
Service quote requests with priority and review workflow.

```
Table: quotes_quote

Fields:
  id                 INT PRIMARY KEY
  customer_id        INT FK -> auth_user (SET_NULL on deletion, nullable)
  quote_number       VARCHAR(50) UNIQUE AUTO-GENERATED (e.g., 'QT-2024-0001')
  service_type       VARCHAR(50) IN (logo_design, web_design, app_development, graphics, video_production, social_media, seo, copywriting, photography, other)
  title              VARCHAR(255)
  description        TEXT
  budget_min         DECIMAL(10,2) NULLABLE
  budget_max         DECIMAL(10,2) NULLABLE
  quoted_amount      DECIMAL(10,2) NULLABLE (amount specified in quote)
  status             VARCHAR(20) IN (submitted, pending_review, quoted, accepted, rejected, completed)
  priority           VARCHAR(20) IN (low, medium, high, urgent) DEFAULT 'medium'
  attachment         FileField (Cloudinary) NULLABLE
  reviewed_by_id     INT FK -> auth_user (SET_NULL, nullable, admin only)
  reviewed_at        DATETIME NULLABLE (when admin reviewed)
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - customer_id
  - quote_number (unique)
  - status
  - priority
  - created_at
  - reviewed_by_id

Constraints:
  - quote_number must be unique
  - service_type IN enum
  - status IN enum
  - budget_min <= budget_max (if both provided)
  - Auto-generated on creation
```

### QuoteComment Model
Communication thread on quotes between customer and admin.

```
Table: quotes_quotecomment

Fields:
  id                 INT PRIMARY KEY
  quote_id           INT FK -> quotes_quote (CASCADE delete)
  author_id          INT FK -> auth_user (CASCADE delete)
  message            TEXT
  is_admin           BOOLEAN DEFAULT False (True if author is staff)
  created_at         DATETIME AUTO

Indexes:
  - quote_id
  - author_id
  - created_at

Constraints:
  - quote must exist
  - author must exist
```

---

## Portfolio App

### PortfolioProject Model
Completed projects and case studies with view tracking.

```
Table: portfolio_portfolioproject

Fields:
  id                 INT PRIMARY KEY
  slug               VARCHAR(255) UNIQUE
  title              VARCHAR(255)
  description        TEXT
  category           VARCHAR(50) IN (web_design, app_development, graphic_design, branding, video_production, photography, social_media, copywriting, consulting)
  featured_image     ImageField (Cloudinary)
  featured           BOOLEAN DEFAULT False
  status             VARCHAR(20) IN (draft, published, archived)
  views              INT DEFAULT 0 (incremented on retrieval)
  client_name        VARCHAR(255) NULLABLE
  completion_date    DATE NULLABLE
  tools_used         JSON (list of strings, e.g., ["React", "Node.js"])
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - slug (unique)
  - category
  - status
  - featured
  - views (for popular sort)
  - created_at

Constraints:
  - slug must be unique
  - status IN enum
  - category IN enum
  - featured_image required
```

### PortfolioImage Model
Gallery images for portfolio projects.

```
Table: portfolio_portfolioimage

Fields:
  id                 INT PRIMARY KEY
  project_id         INT FK -> portfolio_portfolioproject (CASCADE delete)
  image              ImageField (Cloudinary)
  caption            VARCHAR(255) NULLABLE
  order              INT DEFAULT 0 (display order)
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - project_id
  - order

Constraints:
  - project must exist
  - image required
```

---

## Services App

### Service Model
Service offerings with features and pricing information.

```
Table: services_service

Fields:
  id                 INT PRIMARY KEY
  slug               VARCHAR(255) UNIQUE
  name               VARCHAR(255)
  description        TEXT
  service_type       VARCHAR(50) IN (web_design, app_development, graphic_design, video_production, copywriting, seo, social_media, photography, ui_ux, branding, consultation, other)
  price              DECIMAL(10,2)
  revision_rounds    INT DEFAULT 1 (number of revisions included)
  delivery_time      VARCHAR(50) (e.g., "14 days", "1 week")
  features           JSON (list of feature strings)
  featured           BOOLEAN DEFAULT False
  status             VARCHAR(20) IN (active, inactive) DEFAULT 'active'
  icon               VARCHAR(100) NULLABLE (icon identifier)
  created_at         DATETIME AUTO
  updated_at         DATETIME AUTO

Indexes:
  - slug (unique)
  - service_type
  - status
  - featured
  - created_at

Constraints:
  - slug must be unique
  - service_type IN enum
  - status IN enum
  - price >= 0
```

---

## Enumeration Values

### Order Status Workflow
```
pending → confirmed → processing → ready → shipped → delivered
                    ↓
                  cancelled (can cancel at any stage except delivered)
```

### Quote Status Workflow
```
submitted → pending_review → quoted → accepted → completed
                           ↓
                        rejected
```

### Product Status
- `draft`: Not visible in storefront
- `active`: Available for purchase
- `inactive`: Temporarily unavailable
- `discontinued`: Permanently unavailable

### Portfolio Status
- `draft`: Not visible publicly
- `published`: Visible in portfolio
- `archived`: Hidden from active list

### Portfolio Categories (9)
- web_design
- app_development
- graphic_design
- branding
- video_production
- photography
- social_media
- copywriting
- consulting

### Service Types (12)
- web_design
- app_development
- graphic_design
- video_production
- copywriting
- seo
- social_media
- photography
- ui_ux
- branding
- consultation
- other

### Quote Service Types (9)
- logo_design
- web_design
- app_development
- graphics
- video_production
- social_media
- seo
- copywriting
- photography

### Priority Levels
- low: Standard priority
- medium: Normal/default
- high: Urgent
- urgent: ASAP

### Delivery Types
- local_pickup: Customer picks up
- home_delivery: Standard delivery
- express: Express delivery

---

## Database Performance

### Indexes Summary
```
Total Indexes: 35+

High-Traffic Indexes:
- products_product.created_at
- orders_order.user_id
- orders_order.status
- quotes_quote.status
- portfolio_portfolioproject.created_at

Foreign Key Benefits:
- User lookups: O(1)
- Product lookups: O(1)
- Order filtering: O(1) with status index
```

### Query Optimization

**Commonly Used Queries:**
```sql
-- List orders for user
SELECT * FROM orders_order 
WHERE user_id = ? 
  AND status != 'cancelled'
ORDER BY created_at DESC;
-- Uses: user_id index (fast), status index

-- Featured products
SELECT * FROM products_product 
WHERE is_featured = TRUE 
  AND status = 'active'
ORDER BY created_at DESC;
-- Uses: Multiple indexes

-- Portfolio by category
SELECT * FROM portfolio_portfolioproject 
WHERE category = ? 
  AND status = 'published'
ORDER BY views DESC;
-- Uses: category index, views for sorting
```

### Full-Text Search Fields
- Products: name, description, tags
- Quotes: title, description
- Portfolio: title, description, client_name

---

## Data Relationships

### User-Related
```
User
├── Token (1:1 via authtoken_token)
├── Product (1:N) via user-created products
├── Order (1:N) as customer
├── Quote (1:N) as customer
├── OrderStatusLog (1:N) as changed_by (admin)
└── QuoteComment (1:N) as author
```

### Product-Related
```
Category (1:N)
└── Product

Product (1:N)
├── ProductVariant
├── ProductImage
├── OrderItem
└── Quote (implicit via OrderItem.product)
```

### Order-Related
```
Order (1:N)
├── OrderItem (N:1 Product.variants)
├── OrderStatusLog
└── OrderFeedback (1:1)
```

### Quote-Related
```
Quote (1:N)
└── QuoteComment
```

### Portfolio-Related
```
PortfolioProject (1:N)
└── PortfolioImage
```

---

## Cascade & Cleanup Behavior

| Deletion | Behavior |
|----------|----------|
| User deleted | Orders/Quotes anonymized (user_id → NULL), Tokens deleted, Comments deleted |
| Product deleted | Variants deleted, Images deleted |
| ProductVariant deleted | OrderItems updated (FK → NULL) |
| Order deleted | Items deleted, StatusLogs deleted, Feedback deleted |
| Quote deleted | Comments deleted |
| PortfolioProject deleted | Images deleted |

---

## Current Database Size Estimate

For 1 year of data:
- Users: ~10,000 rows (≈ 5 MB)
- Products: ~500 rows (≈ 2 MB)
- ProductVariants: ~2,000 rows (≈ 1 MB)
- ProductImages: ~5,000 rows (≈ 10 MB)
- Orders: ~50,000 rows (≈ 25 MB)
- OrderItems: ~150,000 rows (≈ 30 MB)
- OrderStatusLogs: ~200,000 rows (≈ 15 MB)
- OrderFeedback: ~40,000 rows (≈ 10 MB)
- Quotes: ~5,000 rows (≈ 5 MB)
- QuoteComments: ~15,000 rows (≈ 5 MB)
- PortfolioProjects: ~100 rows (≈ 1 MB)
- PortfolioImages: ~500 rows (≈ 10 MB)
- Services: ~25 rows (≈ 0.5 MB)

**Total: ≈ 120 MB** (without file storage)

---

## Migrations

All models are ready for initial migration:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Backup & Recovery

### Critical Tables for Backup Priority
1. auth_user (user data)
2. orders_order (business transactions)
3. quotes_quote (quote records)
4. products_product (catalog)

### Recommended Backup Schedule
- Daily incremental backups
- Weekly full backups
- Monthly archives

---

## Future Scaling Considerations

### When to Optimize
- **100K+ users**: Add caching layer (Redis)
- **1M+ orders**: Consider sharding by user_id
- **Large images**: Implement image CDN with Cloudinary
- **High write volume**: Consider read replicas

### Recommended Next Steps
- Monitor slow queries with Django Debug Toolbar
- Regular VACUUM/ANALYZE on PostgreSQL
- Archive old orders quarterly
- Implement proper backup schedule