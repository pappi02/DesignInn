# DesignInn Developer Quick Reference

## 🚀 Quick Start (1 minute)

```bash
# Navigate to backend
cd /workspaces/DesignInn/backend/core

# Activate environment (if using venv)
source ../venv/bin/activate  # Linux/Mac
# or venv\Scripts\activate   # Windows

# Run migrations (first time only)
python manage.py migrate

# Create admin user (first time only)
python manage.py createsuperuser

# Start server
python manage.py runserver

# Visit:
# - API: http://localhost:8000/api/v1/
# - Admin: http://localhost:8000/admin/
```

---

## 📁 Project Structure

```
/workspaces/DesignInn/
├── backend/core/                 # Main Django project
│   ├── users/                    # User management
│   ├── products/                 # Products & catalog
│   ├── orders/                   # Order management
│   ├── quotes/                   # Quote requests
│   ├── portfolio/                # Project showcase
│   ├── services/                 # Service offerings
│   ├── common/                   # Shared utilities
│   ├── core/                     # Django settings
│   ├── manage.py                 # Django CLI
│   └── db.sqlite3                # Development database
├── API_REFERENCE.md              # API endpoints (90+)
├── DATABASE_SCHEMA.md            # Database structure
├── SETUP_AND_TESTING.md          # Detailed setup guide
├── PHASE_1_COMPLETE.md           # Implementation details
└── PHASE_1_COMPLETION_SUMMARY.md # Status & next steps
```

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `core/settings.py` | Django config (INSTALLED_APPS, middleware) |
| `core/urls.py` | Main URL routing (/api/v1/) |
| `common/permissions.py` | Auth permissions (IsAdmin, IsAdminOrReadOnly) |
| `common/utils.py` | Helpers (TimestampedModel, order number generation) |
| `*/models.py` | Database models |
| `*/serializers.py` | API serializers |
| `*/views.py` | ViewSets (API logic) |
| `*/admin.py` | Django admin configuration |
| `*/urls.py` | App-specific URL routing |

---

## 🗄️ Database Models (14 Total)

### Quick Model Reference
```
User
  ├── Token (1:1)
  ├── Order (1:N)
  └── Quote (1:N)

Category
  └── Product (1:N)
      ├── ProductVariant (1:N)
      └── ProductImage (1:N)

Order (1:N)
  ├── OrderItem (links to Product/Variant)
  ├── OrderStatusLog (audit trail)
  └── OrderFeedback (1:1 rating)

Quote (1:N)
  └── QuoteComment

PortfolioProject (1:N)
  └── PortfolioImage

Service (standalone)
```

---

## 🔌 API Endpoints (Quick Reference)

### Users
- `POST /users/` - Register
- `GET /users/me/` - Profile
- `PUT /users/me/` - Update profile
- `POST /users/change_password/` - Change password

### Products
- `GET /products/` - List (filter, search, sort)
- `GET /products/featured/` - Featured
- `GET /products/{slug}/` - Details
- `POST /products/` - Create (admin)

### Orders
- `POST /orders/` - Create
- `GET /orders/my_orders/` - My orders
- `GET /orders/{id}/track/` - Track
- `POST /orders/{id}/feedback/` - Add feedback

### Quotes
- `POST /quotes/` - Submit
- `GET /quotes/my_quotes/` - My quotes
- `POST /quotes/{id}/add_comment/` - Comment
- `POST /quotes/{id}/accept/` - Accept

### Portfolio
- `GET /portfolio/` - List
- `GET /portfolio/featured/` - Featured
- `GET /portfolio/{slug}/` - Details

### Services
- `GET /services/` - List
- `GET /services/featured/` - Featured
- `GET /services/by_type/?type=web_design` - Filter

---

## 🛠️ Common Development Tasks

### Add a New API Endpoint

**1. Create model in `models.py`:**
```python
from common.utils import TimestampedModel

class MyModel(TimestampedModel):
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    
    class Meta:
        ordering = ['-created_at']
```

**2. Create serializer in `serializers.py`:**
```python
class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = ['id', 'name', 'status', 'created_at']
```

**3. Create viewset in `views.py`:**
```python
class MyModelViewSet(viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MyModelSerializer
    permission_classes = [permissions.IsAdminOrReadOnly]
    
    @action(detail=True, methods=['post'])
    def custom_action(self, request, pk=None):
        obj = self.get_object()
        # Do something
        return Response({'status': 'success'})
```

**4. Register in `urls.py`:**
```python
router.register(r'mymodels', MyModelViewSet)
```

### Add Authentication to an Endpoint
```python
from rest_framework.permissions import IsAuthenticated

class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    # Only authenticated users can access
```

### Add Admin Customization

**In `admin.py`:**
```python
from django.contrib import admin
from .models import MyModel

@admin.register(MyModel)
class MyModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name']
    actions = ['mark_active']
    
    def mark_active(self, request, queryset):
        queryset.update(status='active')
    mark_active.short_description = "Mark selected items as active"
```

### Run Tests
```bash
# All tests
python manage.py test

# Specific app
python manage.py test users

# Specific test class
python manage.py test users.tests.UserModelTests

# Specific test method
python manage.py test users.tests.UserModelTests.test_user_creation

# With coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report -m
coverage html  # Open htmlcov/index.html
```

### Create Test Data
```bash
python manage.py shell

# Create category
from products.models import Category
cat = Category.objects.create(name='T-Shirts', icon='shirt')

# Create product
from products.models import Product
Product.objects.create(
    name='Test Shirt',
    slug='test-shirt',
    price=29.99,
    category=cat
)

# Exit shell
exit()
```

---

## 🧪 Testing Patterns

### Test a Model
```python
from django.test import TestCase
from products.models import Product, Category

class ProductModelTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Test')
        self.product = Product.objects.create(
            name='Test',
            slug='test',
            category=self.category,
            price=29.99
        )
    
    def test_product_creation(self):
        self.assertEqual(self.product.name, 'Test')
        self.assertEqual(self.product.price, 29.99)
```

### Test an API Endpoint
```python
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class ProductAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )
    
    def test_list_products(self):
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, 200)
```

### Test with Authentication
```python
def test_authenticated_endpoint(self):
    self.client.force_authenticate(user=self.user)
    response = self.client.get('/api/v1/users/me/')
    self.assertEqual(response.status_code, 200)
```

---

## 🐛 Debugging Tips

### Check Database Queries
```bash
python manage.py shell

from django.db import connection
from products.models import Product

Product.objects.all()

# Print all SQL queries
for query in connection.queries:
    print(f"{query['time']}: {query['sql']}")
```

### Interactive Shell
```bash
python manage.py shell

from users.models import User
user = User.objects.get(id=1)
print(user.email, user.phone)

from products.models import Product
products = Product.objects.filter(status='active')
print(f"Found {products.count()} active products")
```

### View Raw SQL
```bash
python manage.py shell

from products.models import Product
qs = Product.objects.filter(status='active')
print(qs.query)  # Shows SQL query
```

### Check Migrations
```bash
# See migration status
python manage.py showmigrations

# Show planned migrations
python manage.py showmigrations --plan

# Show SQL that will be run
python manage.py sqlmigrate app_name 0001
```

---

## 🔒 Authentication Flow

### API Authentication Process
```
1. User Registration (POST /users/)
   → Returns: token

2. Store Token (localStorage/session)

3. Make Authenticated Request
   Header: Authorization: Token abc123xyz789
   
4. Server Validates Token
   → On success: Allow request
   → On failure: Return 401

5. Logout (POST /users/logout/)
   → Token validation ends
```

### Check Token in Shell
```bash
python manage.py shell

from rest_framework.authtoken.models import Token
from users.models import User

user = User.objects.get(id=1)
token = Token.objects.get(user=user)
print(token.key)
```

---

## 📊 Pagination

All list endpoints support pagination:
```
GET /api/v1/products/?page=1&page_size=25

Response includes:
- count: Total items
- next: URL to next page
- previous: URL to previous page
- results: Array of items
```

---

## 🔍 Filtering & Search Examples

```
# Filter by status
GET /products/?status=active

# Search
GET /products/?search=shirt

# Filter by category
GET /products/?category=1

# Order by
GET /products/?ordering=-price

# Combine
GET /products/?search=shirt&status=active&ordering=name
```

---

## 📝 Code Style Guidelines

### Model Naming
- Always singular: `Product`, not `Products`
- Descriptive: `ProductVariant`, not `Variant`

### Serializer Naming
- `MyModelSerializer` - Full model serializer
- `MyModelListSerializer` - For list view
- `MyModelDetailSerializer` - For detail view
- `MyModelCreateSerializer` - For create/update

### ViewSet Naming
- `MyModelViewSet` - Main viewset
- Custom actions: `@action(detail=True, methods=['post'])`

### URL Patterns
- Use hyphens: `/api/v1/my-endpoint/`, not `/api/v1/my_endpoint/`
- Use slugs for detail lookup: `/api/v1/products/my-product-slug/`

---

## 🚨 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `ModuleNotFoundError: rest_framework` | `pip install -r requirements.txt` |
| `FOREIGN KEY constraint failed` | Check model relationships |
| `Port 8000 already in use` | Use different port: `python manage.py runserver 8001` |
| `No migrations available` | Run: `python manage.py makemigrations` then `python manage.py migrate` |
| `CORS error` | Check `CORS_ALLOWED_ORIGINS` in settings.py |
| `401 Unauthorized` | Add token to header or ensure user is authenticated |
| `403 Permission Denied` | Check user role and permission_classes |

---

## 📚 Documentation Reference

- **API Docs**: See `API_REFERENCE.md` (90+ endpoints documented)
- **Database Schema**: See `DATABASE_SCHEMA.md` (14 models detailed)
- **Setup Guide**: See `SETUP_AND_TESTING.md` (complete setup instructions)
- **Project Status**: See `PHASE_1_COMPLETION_SUMMARY.md` (what's built)

---

## 🎯 Development Workflow

### For Adding Features
1. **Create model** in `models.py` with validators
2. **Create serializer(s)** in `serializers.py`
3. **Create viewset** in `views.py` with actions
4. **Add URL routing** in `urls.py`
5. **Add admin** in `admin.py` (if needed)
6. **Write tests** in `tests.py`
7. **Document** endpoint in API_REFERENCE.md

### For Fixing Bugs
1. Locate bug in code
2. Write test that reproduces bug
3. Fix implementation
4. Verify test passes
5. Run full test suite
6. Commit with clear message

### For Admin Features
1. Check `admin.py` in relevant app
2. Add list_display, list_filter, search_fields
3. Create bulk actions as needed
4. Add inline editing for related models
5. Test in admin panel at http://localhost:8000/admin/

---

## 🚀 Performance Tips

### Database Queries
- Use `select_related()` for foreign keys
- Use `prefetch_related()` for reverse relations
- Add database indexes on filtered fields

### API Performance
- Use pagination (default 12 items/page)
- Implement caching for static data
- Optimize serializer fields
- Use Cloudinary for file storage

### Admin Performance
- Limit list_display items
- Use raw_id_fields for large foreign keys
- Implement search_fields for filtering

---

## 🔄 Version Control

### Commit Messages
```
Good: "Add quote status update endpoint"
Bad: "Update views"

Good: "Fix product variant stock calculation"
Bad: "Fix bug"

Good: "Add email notification for orders"
Bad: "Add feature"
```

### Branch Naming
```
Feature: feature/quote-comments
Bugfix: bugfix/order-status-validation
```

---

## 📞 Getting Help

### Django Resources
- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/

### Django Shell Help
```bash
python manage.py shell

# Get model fields
from products.models import Product
Product._meta.fields

# Get field type
Product._meta.get_field('price')

# Query examples
Product.objects.filter(status='active').count()
```

### Check Logs
```bash
# Debug error details
tail -f /path/to/logfile

# Or check Django console output
```

---

## ✅ Pre-Commit Checklist

Before committing code:
- [ ] Run tests: `python manage.py test`
- [ ] Check formatting: `black .` (if configured)
- [ ] Check imports: `flake8 .` (if configured)
- [ ] No hardcoded credentials
- [ ] Added docstrings if new code
- [ ] Updated `API_REFERENCE.md` if new endpoint
- [ ] Clear commit message

---

## 🎊 Quick Stats

| Metric | Value |
|--------|-------|
| Django Apps | 7 |
| Models | 14 |
| Serializers | 28+ |
| ViewSets | 9 |
| API Endpoints | 90+ |
| Lines of Code | 4,500+ |
| Test Cases | 14+ (Users) |
| Admin Classes | 6+ |
| Documentation Files | 5 |

---

## 📋 Checklist for New Developers

- [ ] Clone repository
- [ ] Read this file (DEVELOPER_QUICK_REFERENCE.md)
- [ ] Read PHASE_1_COMPLETION_SUMMARY.md
- [ ] Read API_REFERENCE.md (bookmark it)
- [ ] Run `python manage.py migrate`
- [ ] Run `python manage.py createsuperuser`
- [ ] Start server: `python manage.py runserver`
- [ ] Visit http://localhost:8000/admin/ and explore
- [ ] Visit http://localhost:8000/api/v1/ and browse API
- [ ] Run tests: `python manage.py test`
- [ ] Read the relevant app's code (start with `users/`)
- [ ] Try making a test API request
- [ ] Ask questions in team channels

---

**For detailed information, refer to the comprehensive documentation files in the project root.**