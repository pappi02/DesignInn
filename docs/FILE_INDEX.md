# DesignInn Project - File Index & Navigation Guide

## 📂 Project Root Structure

```
/workspaces/DesignInn/
├── 📄 README.md                              # Main project overview
├── 📄 IMPLEMENTATION_TODO.md                 # 40-phase implementation checklist
├── 📄 PHASE_1_COMPLETION_SUMMARY.md          # Phase 1 completion status & next steps
├── 📄 PHASE_1_COMPLETE.md                    # Technical implementation details
├── 📄 API_REFERENCE.md                       # Complete API documentation (90+ endpoints)
├── 📄 DATABASE_SCHEMA.md                     # Database models and schema documentation
├── 📄 SETUP_AND_TESTING.md                   # Installation guide and testing instructions
├── 📄 DEVELOPER_QUICK_REFERENCE.md           # Quick reference for developers
│
└── 📁 backend/
    ├── 📄 requirements.txt                   # Python dependencies
    ├── 📄 .env.example                       # Environment variables template
    │
    └── 📁 core/                              # Django project root
        ├── 📄 manage.py                      # Django management CLI
        ├── 📄 db.sqlite3                     # Development database (created after migrate)
        │
        ├── 📁 core/                          # Django main settings app
        │   ├── __init__.py
        │   ├── asgi.py
        │   ├── settings.py                   # ⭐ Main Django configuration (apps, middleware, db)
        │   ├── urls.py                       # ⭐ Main URL routing (routes to /api/v1/ namespace)
        │   └── wsgi.py
        │
        ├── 📁 common/                        # Shared utilities across all apps
        │   ├── __init__.py
        │   ├── pagination.py                 # StandardPagination (12 items/page)
        │   ├── permissions.py                # IsAdmin, IsAdminOrReadOnly, CanViewOwnOrderOrAdmin
        │   ├── exceptions.py                 # Custom exception handler
        │   ├── validators.py                 # Phone, file size, file type validators
        │   ├── utils.py                      # TimestampedModel, order/quote generators
        │   └── apps.py
        │
        │
        ├── 📁 users/                         # User management & authentication
        │   ├── __init__.py
        │   ├── models.py                     # ⭐ User model (extended AbstractUser)
        │   ├── serializers.py                # ⭐ 4 serializers (Create, Detail, Update, List)
        │   ├── views.py                      # ⭐ UserViewSet (8 custom actions)
        │   ├── urls.py                       # ⭐ User API routes
        │   ├── admin.py                      # ⭐ User admin panel
        │   ├── apps.py                       # Signal registration
        │   ├── signals.py                    # Token creation & cleanup handlers
        │   ├── tests.py                      # Comprehensive test suite (14 tests)
        │   ├── migrations/
        │   │   └── 0001_initial.py
        │   └── __pycache__/
        │
        ├── 📁 products/                      # Merchandise catalog & inventory
        │   ├── __init__.py
        │   ├── models.py                     # ⭐ Category, Product, ProductVariant, ProductImage
        │   ├── serializers.py                # ⭐ 6 serializers (with nested relationships)
        │   ├── views.py                      # ⭐ 3 ViewSets (ProductViewSet, VariantViewSet, ImageViewSet)
        │   ├── urls.py                       # ⭐ Products API routes
        │   ├── admin.py                      # ⭐ Products admin with inline variants/images
        │   ├── apps.py
        │   ├── tests.py                      # (To be created in Phase 1.7)
        │   ├── migrations/
        │   │   └── 0001_initial.py
        │   └── __pycache__/
        │
        ├── 📁 orders/                        # Order management & processing
        │   ├── __init__.py
        │   ├── models.py                     # ⭐ Order, OrderItem, OrderStatusLog, OrderFeedback
        │   ├── serializers.py                # ⭐ 6 serializers (with nested relationships)
        │   ├── views.py                      # ⭐ OrderViewSet (8 custom actions)
        │   ├── urls.py                       # ⭐ Orders API routes
        │   ├── admin.py                      # ⭐ Orders admin with inline items & logs
        │   ├── apps.py
        │   ├── tests.py                      # (To be created in Phase 1.7)
        │   ├── migrations/
        │   │   └── 0001_initial.py
        │   └── __pycache__/
        │
        ├── 📁 quotes/                        # Service quote requests
        │   ├── __init__.py
        │   ├── models.py                     # ⭐ Quote, QuoteComment
        │   ├── serializers.py                # ⭐ 6 serializers (status workflow)
        │   ├── views.py                      # ⭐ QuoteViewSet (8 custom actions)
        │   ├── urls.py                       # ⭐ Quotes API routes
        │   ├── admin.py                      # ⭐ Quotes admin with comment inline
        │   ├── apps.py
        │   ├── tests.py                      # (To be created in Phase 1.7)
        │   ├── migrations/
        │   │   └── 0001_initial.py
        │   └── __pycache__/
        │
        ├── 📁 portfolio/                     # Project portfolio showcase
        │   ├── __init__.py
        │   ├── models.py                     # ⭐ PortfolioProject, PortfolioImage
        │   ├── serializers.py                # ⭐ 3 serializers (with image gallery)
        │   ├── views.py                      # ⭐ 2 ViewSets (projects, images)
        │   ├── urls.py                       # ⭐ Portfolio API routes
        │   ├── admin.py                      # ⭐ Portfolio admin with image preview
        │   ├── apps.py
        │   ├── tests.py                      # (To be created in Phase 1.7)
        │   ├── migrations/
        │   │   └── 0001_initial.py
        │   └── __pycache__/
        │
        ├── 📁 services/                      # Service offerings & pricing
        │   ├── __init__.py
        │   ├── models.py                     # ⭐ Service model (12 service types)
        │   ├── serializers.py                # ⭐ 3 serializers
        │   ├── views.py                      # ⭐ ServiceViewSet (3 custom actions)
        │   ├── urls.py                       # ⭐ Services API routes
        │   ├── admin.py                      # ⭐ Services admin with bulk actions
        │   ├── apps.py
        │   ├── tests.py                      # (To be created in Phase 1.7)
        │   ├── migrations/
        │   │   └── 0001_initial.py
        │   └── __pycache__/
        │
        └── 📁 venv/                          # Virtual environment (if created locally)
            └── (Python packages installed here)
```

---

## 📖 Documentation Files Guide

### Getting Started
1. **Start here**: [README.md](README.md) - Project overview
2. **Quick setup**: [DEVELOPER_QUICK_REFERENCE.md](DEVELOPER_QUICK_REFERENCE.md) - Developer quick start
3. **Full setup**: [SETUP_AND_TESTING.md](SETUP_AND_TESTING.md) - Detailed installation guide

### Understanding the Project
4. **What's built**: [PHASE_1_COMPLETION_SUMMARY.md](PHASE_1_COMPLETION_SUMMARY.md) - Complete Phase 1 status
5. **Technical details**: [PHASE_1_COMPLETE.md](PHASE_1_COMPLETE.md) - Implementation details
6. **Implementation plan**: [IMPLEMENTATION_TODO.md](IMPLEMENTATION_TODO.md) - 40-phase checklist

### API & Database Reference
7. **API endpoints**: [API_REFERENCE.md](API_REFERENCE.md) - All 90+ endpoints documented
8. **Database schema**: [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - All 14 models detailed

---

## 🗂️ Django App Structure (Each App Follows Same Pattern)

Each app (`users`, `products`, `orders`, `quotes`, `portfolio`, `services`) contains:

| File | Purpose | Lines |
|------|---------|-------|
| `models.py` | Database models with relationships | 50-150 |
| `serializers.py` | API serializers (multiple per app) | 80-200 |
| `views.py` | ViewSets with custom actions | 100-300 |
| `urls.py` | URL routing configuration | 20-50 |
| `admin.py` | Django admin customization | 50-150 |
| `tests.py` | Unit tests (TODO for most apps) | Variable |
| `apps.py` | App configuration & signals | 10-30 |
| `migrations/` | Database migrations | Auto-generated |

---

## 🎯 Quick Navigation by Task

### I want to:

**Understand the project quickly**
→ Read [DEVELOPER_QUICK_REFERENCE.md](DEVELOPER_QUICK_REFERENCE.md)

**Install & run the backend**
→ Read [SETUP_AND_TESTING.md](SETUP_AND_TESTING.md)

**See all API endpoints**
→ Read [API_REFERENCE.md](API_REFERENCE.md)

**Understand the database**
→ Read [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

**Add a new model**
→ Edit `backend/core/[app_name]/models.py`

**Add a new API endpoint**
→ Edit `backend/core/[app_name]/serializers.py`, `views.py`, `urls.py`

**Customize admin panel**
→ Edit `backend/core/[app_name]/admin.py`

**Write tests**
→ Edit `backend/core/[app_name]/tests.py`

**Configure Django settings**
→ Edit `backend/core/core/settings.py`

**Configure main URLs**
→ Edit `backend/core/core/urls.py`

**Add shared utilities**
→ Edit `backend/core/common/[file].py`

---

## 🔍 Finding Code by Feature

### User Authentication
- **Models**: `backend/core/users/models.py`
- **Views**: `backend/core/users/views.py` (register, login, profile actions)
- **Serializers**: `backend/core/users/serializers.py`
- **Signals**: `backend/core/users/signals.py` (token creation)
- **Permissions**: `backend/core/common/permissions.py`
- **Tests**: `backend/core/users/tests.py`

### Product Management
- **Models**: `backend/core/products/models.py`
- **Views**: `backend/core/products/views.py` (featured, search, filtering)
- **Serializers**: `backend/core/products/serializers.py`
- **Admin**: `backend/core/products/admin.py` (inline variants, images)
- **Tests**: `backend/core/products/tests.py` (TODO)

### Order Processing
- **Models**: `backend/core/orders/models.py` (status workflow, stock management)
- **Views**: `backend/core/orders/views.py` (order lifecycle, tracking)
- **Serializers**: `backend/core/orders/serializers.py`
- **Admin**: `backend/core/orders/admin.py` (inline items, status logs)
- **Tests**: `backend/core/orders/tests.py` (TODO)

### Quote Management
- **Models**: `backend/core/quotes/models.py` (priority system, comments)
- **Views**: `backend/core/quotes/views.py` (status workflow)
- **Serializers**: `backend/core/quotes/serializers.py`
- **Admin**: `backend/core/quotes/admin.py`
- **Tests**: `backend/core/quotes/tests.py` (TODO)

### Portfolio Display
- **Models**: `backend/core/portfolio/models.py` (view tracking)
- **Views**: `backend/core/portfolio/views.py` (featured, by category)
- **Serializers**: `backend/core/portfolio/serializers.py`
- **Admin**: `backend/core/portfolio/admin.py` (image preview)
- **Tests**: `backend/core/portfolio/tests.py` (TODO)

### Services
- **Models**: `backend/core/services/models.py` (12 types, features)
- **Views**: `backend/core/services/views.py` (type filtering)
- **Serializers**: `backend/core/services/serializers.py`
- **Admin**: `backend/core/services/admin.py`
- **Tests**: `backend/core/services/tests.py` (TODO)

### Common Utilities
- **Pagination**: `backend/core/common/pagination.py`
- **Permissions**: `backend/core/common/permissions.py`
- **Validators**: `backend/core/common/validators.py`
- **Utils**: `backend/core/common/utils.py`
- **Exceptions**: `backend/core/common/exceptions.py`

### Base Configuration
- **Settings**: `backend/core/core/settings.py` (Django config, installed apps)
- **URLs**: `backend/core/core/urls.py` (main API routing)
- **WSGI**: `backend/core/core/wsgi.py` (deployment)

---

## 📊 File Statistics

### Core Django Configuration
- `core/settings.py` - ~250 lines
- `core/urls.py` - ~30 lines
- `manage.py` - ~10 lines

### Common Utilities (~250 lines total)
- `common/pagination.py` - ~20 lines
- `common/permissions.py` - ~50 lines
- `common/validators.py` - ~60 lines
- `common/exceptions.py` - ~40 lines
- `common/utils.py` - ~80 lines

### Users App (~400 lines)
- `users/models.py` - ~50 lines
- `users/serializers.py` - ~80 lines
- `users/views.py` - ~150 lines
- `users/admin.py` - ~50 lines
- `users/signals.py` - ~40 lines
- `users/tests.py` - ~180 lines

### Products App (~600 lines)
- `products/models.py` - ~120 lines
- `products/serializers.py` - ~200 lines
- `products/views.py` - ~200 lines
- `products/admin.py` - ~80 lines

### Orders App (~500 lines)
- `orders/models.py` - ~150 lines
- `orders/serializers.py` - ~150 lines
- `orders/views.py` - ~150 lines
- `orders/admin.py` - ~50 lines

### Quotes App (~400 lines)
- `quotes/models.py` - ~80 lines
- `quotes/serializers.py` - ~150 lines
- `quotes/views.py` - ~120 lines
- `quotes/admin.py` - ~50 lines

### Portfolio App (~350 lines)
- `portfolio/models.py` - ~80 lines
- `portfolio/serializers.py` - ~100 lines
- `portfolio/views.py` - ~120 lines
- `portfolio/admin.py` - ~50 lines

### Services App (~250 lines)
- `services/models.py` - ~60 lines
- `services/serializers.py` - ~80 lines
- `services/views.py` - ~80 lines
- `services/admin.py` - ~30 lines

**Total Python Code: ~4,500+ lines**

---

## 🚀 File Priority (What to Read First)

### For Understanding the Project
1. ⭐⭐⭐ `DEVELOPER_QUICK_REFERENCE.md`
2. ⭐⭐⭐ `PHASE_1_COMPLETION_SUMMARY.md`
3. ⭐⭐ `API_REFERENCE.md`
4. ⭐⭐ `DATABASE_SCHEMA.md`
5. ⭐ `PHASE_1_COMPLETE.md`

### For Implementation
1. ⭐⭐⭐ `backend/core/core/settings.py` (Django config)
2. ⭐⭐⭐ `backend/core/core/urls.py` (API routing)
3. ⭐⭐ `backend/core/common/utils.py` (shared utilities)
4. ⭐⭐ `backend/core/[app_name]/models.py` (your app's models)
5. ⭐ `backend/core/[app_name]/serializers.py` (API serializers)
6. ⭐ `backend/core/[app_name]/views.py` (API logic)

---

## 💾 Important Configuration Files

### Environment
- `backend/.env.example` - Environment variables template
- `backend/requirements.txt` - Python dependencies (30+ packages)

### Django
- `backend/core/core/settings.py` - Main configuration
- `backend/core/core/urls.py` - URL routing

### App Configurations
- `backend/core/[app_name]/apps.py` - App configuration & signals
- `backend/core/[app_name]/migrations/` - Database migrations

---

## 📝 Documentation Structure

### Reference Documents (Use as needed)
| File | Purpose | Lines | Read When |
|------|---------|-------|-----------|
| API_REFERENCE.md | All endpoints with examples | 500+ | Building frontend |
| DATABASE_SCHEMA.md | All models detailed | 600+ | Understanding relationships |
| DEVELOPER_QUICK_REFERENCE.md | Quick dev guide | 400+ | When coding |
| SETUP_AND_TESTING.md | Detailed setup | 500+ | Setting up environment |

### Status Documents (Current state)
| File | Purpose | Lines | Read When |
|------|---------|-------|-----------|
| PHASE_1_COMPLETION_SUMMARY.md | What's done, what's next | 400+ | Project kickoff |
| PHASE_1_COMPLETE.md | Implementation details | 200+ | Understanding architecture |
| IMPLEMENTATION_TODO.md | 40-phase checklist | 300+ | Long-term planning |

---

## 🔗 Cross-References

### From API_REFERENCE.md
→ Go to DATABASE_SCHEMA.md to see model details
→ Go to backend/core/[app_name]/views.py for implementation

### From DATABASE_SCHEMA.md
→ Go to backend/core/[app_name]/models.py for source code
→ Go to API_REFERENCE.md to see endpoints using this model

### From DEVELOPER_QUICK_REFERENCE.md
→ Go to SETUP_AND_TESTING.md for detailed instructions
→ Go to backend/core/[app_name]/ for actual code

---

## 🎓 Learning Path

### Day 1: Project Orientation
1. Read `DEVELOPER_QUICK_REFERENCE.md`
2. Read `PHASE_1_COMPLETION_SUMMARY.md`
3. skim `API_REFERENCE.md`

### Day 2: Environment Setup
1. Follow `SETUP_AND_TESTING.md`
2. Get server running locally
3. Explore admin panel

### Day 3: Code Exploration
1. Read `backend/core/core/settings.py`
2. Read `backend/core/core/urls.py`
3. Read `backend/core/users/models.py`
4. Read `backend/core/users/serializers.py`

### Day 4: Understanding Models
1. Read `DATABASE_SCHEMA.md`
2. Read all `models.py` files in sequence
3. Trace relationships between models

### Day 5: Understanding API
1. Read `API_REFERENCE.md` carefully
2. Read all `serializers.py` files
3. Read all `views.py` files

### Day 6+: Contributing
1. Pick a feature to work on
2. Refer to DEVELOPER_QUICK_REFERENCE.md for patterns
3. Write code following established patterns
4. Write tests
5. Commit with clear messages

---

## ✅ Checklist: Have You Read?

- [ ] DEVELOPER_QUICK_REFERENCE.md
- [ ] PHASE_1_COMPLETION_SUMMARY.md
- [ ] API_REFERENCE.md (at least overview)
- [ ] DATABASE_SCHEMA.md (at least model list)
- [ ] SETUP_AND_TESTING.md (if setting up)
- [ ] backend/core/core/settings.py (have you skimmed it?)
- [ ] backend/core/core/urls.py (have you looked at routing?)
- [ ] backend/core/users/models.py (have you read it?)

---

**This file is your map of the project. Bookmark it for quick reference!**