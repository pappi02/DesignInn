# DesignInn Backend - Setup & Testing Guide

## Quick Start (5 minutes)

### 1. Navigate to Backend Directory
```bash
cd /workspaces/DesignInn/backend/core
```

### 2. Verify Python Environment
```bash
python --version   # Should be 3.9+
pip --version
```

### 3. Install Dependencies (if not already installed)
```bash
pip install -r ../requirements.txt
```

### 4. Create Database
```bash
# For PostgreSQL (production):
# Make sure PostgreSQL is running, then:
python manage.py migrate

# For SQLite (development):
# Automatically created on first migration
python manage.py migrate
```

### 5. Create Superuser
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

### 6. Start Development Server
```bash
python manage.py runserver
```

**API is now available at**: `http://localhost:8000/api/v1/`
**Admin panel at**: `http://localhost:8000/admin/`

---

## Complete Setup Instructions

### Prerequisites
- Python 3.9 or higher
- PostgreSQL 12+ (or SQLite for development)
- pip or conda package manager
- Git

### Directory Structure
```
/workspaces/DesignInn/
├── backend/
│   ├── core/                  # Django project root
│   │   ├── manage.py
│   │   ├── users/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── quotes/
│   │   ├── portfolio/
│   │   ├── services/
│   │   ├── common/
│   │   ├── core/              # Settings & URLs
│   │   ├── core/settings.py   # Django configuration
│   │   └── db.sqlite3         # SQLite (if used)
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Environment variables template
├── frontend/                  # (To be created in Phase 2)
├── README.md
├── API_REFERENCE.md           # Complete API documentation
├── DATABASE_SCHEMA.md         # Database structure
└── IMPLEMENTATION_TODO.md     # Implementation checklist

```

### Step 1: Environment Setup

**Option A: Using Virtual Environment**
```bash
# Navigate to backend directory
cd /workspaces/DesignInn/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

**Option B: Using Conda**
```bash
# Create conda environment
conda create -n designinn python=3.11

# Activate environment
conda activate designinn
```

### Step 2: Install Dependencies
```bash
# Ensure you're in /workspaces/DesignInn/backend directory
pip install -r requirements.txt

# Verify installation
pip list | grep -E "Django|djangorestframework|psycopg2|Pillow|python-decouple"
```

### Step 3: Environment Variables Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

**.env Configuration**
```
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=designinn
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# Cloudinary (optional, for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_password

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Step 4: Database Setup

**For PostgreSQL (Production):**
```bash
# Ensure PostgreSQL is running
psql -U postgres

# In psql shell:
CREATE DATABASE designinn;
CREATE USER designinn_user WITH PASSWORD 'strong_password';
ALTER ROLE designinn_user SET client_encoding TO 'utf8';
ALTER ROLE designinn_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE designinn_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE designinn TO designinn_user;
\q
```

**For SQLite (Development - Automatic):**
```bash
# SQLite database is created automatically
# Just run migrations
```

### Step 5: Run Migrations
```bash
# Navigate to core directory
cd /workspaces/DesignInn/backend/core

# Create migrations (if not already created)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Output should show:
# Running migrations:
#   Applying contenttypes.0001_initial... OK
#   Applying auth.0001_initial... OK
#   ... (more migrations)
#   Applying services.0001_initial... OK
```

### Step 6: Create Superuser Account
```bash
python manage.py createsuperuser

# You'll be prompted:
# Username: admin
# Email: admin@designinn.com
# Password: ****
# Password (again): ****
# Superuser created successfully.
```

### Step 7: Start Development Server
```bash
python manage.py runserver

# Output:
# Django version 4.2.0, using settings 'core.settings'
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CONTROL-C.
```

### Step 8: Verify Installation
```bash
# In another terminal, test API
curl http://localhost:8000/api/v1/

# Should return:
# {"message":"API v1 endpoint"}
```

---

## Testing the API

### Manual Testing with cURL

**1. Register a New User**
```bash
curl -X POST http://localhost:8000/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '
{
  "email": "testuser@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}'

# Response:
# {
#   "success": true,
#   "data": {
#     "id": 1,
#     "email": "testuser@example.com",
#     "token": "abc123xyz789...",
#     "first_name": "John",
#     "last_name": "Doe"
#   }
# }
```

**2. Save Token for Authenticated Requests**
```bash
# Export token for easy use
export TOKEN="abc123xyz789..."
```

**3. Get User Profile**
```bash
curl -X GET http://localhost:8000/api/v1/users/me/ \
  -H "Authorization: Token $TOKEN"
```

**4. Create a Product (Admin)**
```bash
curl -X POST http://localhost:8000/api/v1/products/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token $ADMIN_TOKEN" \
  -d '
{
  "name": "Premium T-Shirt",
  "slug": "premium-t-shirt",
  "description": "High quality cotton t-shirt",
  "price": 29.99,
  "category": 1,
  "status": "active"
}'
```

### Testing with Postman

1. **Download Postman**: https://www.postman.com/downloads/
2. **Import Collection**: 
   - File → Import → Choose `DesignInn.postman_collection.json`
3. **Set Environment Variables**:
   - Choose Environment dropdown
   - Create new environment
   - Set `base_url` = `http://localhost:8000/api/v1`
   - Set `token` = (obtained from registration/login)
4. **Run Requests**: Click any request and click "Send"

---

## Running Tests

### Unit Tests
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users

# Run with verbosity
python manage.py test --verbosity=2

# Run specific test class
python manage.py test users.tests.UserModelTests

# Run with coverage report
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Test Output Example
```
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
..................................
----------------------------------------------------------------------
Ran 34 tests in 0.524s

OK
Destroying test database for alias 'default'...
```

### Coverage Report
```bash
coverage html
# Opens htmlcov/index.html in browser
```

---

## Database Operations

### Create Dummy Data for Testing
```bash
python manage.py shell

# In Django shell:
from users.models import User
from products.models import Category, Product

# Create category
cat = Category.objects.create(name='T-Shirts', icon='shirt', order=1)

# Create product
Product.objects.create(
    name='Sample T-Shirt',
    slug='sample-t-shirt',
    price=29.99,
    category=cat,
    status='active'
)

exit()
```

### Database Queries
```bash
# Connect to database
# For SQLite:
sqlite3 db.sqlite3

# For PostgreSQL:
psql -U designinn_user -d designinn
```

### Inspect Models
```bash
python manage.py shell

# List users
from users.models import User
User.objects.all()

# Get user details
user = User.objects.get(email='admin@example.com')
user.email
user.phone

# Count objects
from products.models import Product
Product.objects.count()

# Filter objects
Product.objects.filter(status='active').count()

exit()
```

---

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'rest_framework'"
**Solution:**
```bash
pip install djangorestframework
pip install -r requirements.txt
```

### Issue: PostgreSQL Connection Error
**Solution:**
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Check credentials in .env
psql -U designinn_user -d designinn
```

### Issue: Port 8000 Already in Use
**Solution:**
```bash
# Use different port
python manage.py runserver 8001

# Or kill existing process
lsof -i :8000
kill -9 <PID>
```

### Issue: "No such table" Error After Migration
**Solution:**
```bash
# Delete old database and remigrate
rm db.sqlite3

# Run migrations
python manage.py migrate
```

### Issue: CORS Errors in Frontend
**Solution:**
```bash
# Check CORS_ALLOWED_ORIGINS in settings.py
# Ensure frontend URL is included
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## Admin Panel Guide

### Accessing Admin
1. Go to `http://localhost:8000/admin/`
2. Log in with superuser credentials
3. You should see:
   - Authentication and Authorization
   - Users
   - Products (with Categories, Variants, Images)
   - Orders (with Items, Status Logs, Feedback)
   - Quotes (with Comments)
   - Portfolio (with Projects, Images)
   - Services

### Admin Features

**Users Admin**
- View/edit user profiles
- Change user status (staff, superuser)
- See user registration date
- Manage company information

**Products Admin**
- Create/edit products with inline variants and images
- Select category and set display order
- Toggle featured status
- Add product images with alt text
- Bulk actions: Mark featured, Mark active/inactive

**Orders Admin**
- View customer orders with items and status history
- Track order lifecycle
- Add status notes (payment verified, production started, etc.)
- View customer feedback
- Bulk status update

**Quotes Admin**
- Review pending quotes
- Add quotes with pricing
- Communicate via comments
- Manage quote status workflow

**Portfolio Admin**
- Create/edit portfolio projects
- Add project images
- Set as featured
- Categorize projects

**Services Admin**
- Create service offerings
- Set pricing and delivery time
- Add feature lists
- Toggle featured status

---

## Performance Testing

### Database Query Monitoring
```bash
# Enable SQL Query Logging
# In Django shell:
from django.db import connection
from django.test.utils import override_settings

User.objects.all()
print(connection.queries)
# Shows all SQL queries executed
```

### Load Testing with Locust
```bash
# Install locust
pip install locust

# Create locustfile.py
cat > locustfile.py << 'EOF'
from locust import HttpUser, task, between

class APIUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def view_products(self):
        self.client.get("/api/v1/products/")
    
    @task
    def view_quotes(self):
        self.client.get("/api/v1/quotes/")
EOF

# Run load test
locust -f locustfile.py --host=http://localhost:8000

# Access UI at http://localhost:8089
```

### Response Time Monitoring
```bash
# Install django-silk for detailed monitoring
pip install django-silk

# Add to MIDDLEWARE in settings.py
'silk.middleware.SilkyMiddleware',

# Add to INSTALLED_APPS
'silk',

# Run migrations
python manage.py migrate

# Access UI at http://localhost:8000/silk/
```

---

## Deployment Preparation Checklist

### Before Deploying to Production

- [ ] Set `DEBUG = False` in settings.py
- [ ] Generate new `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS` with domain
- [ ] Set up PostgreSQL database
- [ ] Configure Cloudinary credentials
- [ ] Set up email backend
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS origins
- [ ] Run `collectstatic` for static files
- [ ] Set up monitoring and logging
- [ ] Run security checks: `python manage.py check --deploy`
- [ ] Create `.env` file in production with secure values
- [ ] Set up backup strategy
- [ ] Configure CI/CD pipeline

### Production Checklist Commands
```bash
# Check for security issues
python manage.py check --deploy

# Collect static files
python manage.py collectstatic --no-input

# Run tests before deployment
python manage.py test

# Check all migrations are applied
python manage.py showmigrations --plan
```

---

## Useful Management Commands

```bash
# Create migrations (after model changes)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Show migration status
python manage.py showmigrations

# Interactive Django shell
python manage.py shell

# Run development server with threading
python manage.py runserver --use-threading

# Create test database without running tests
python manage.py migrate --run-syncdb

# Flush all data (WARNING: deletes all data)
python manage.py flush

# Collect static files for production
python manage.py collectstatic

# Check overall project health
python manage.py check

# Show all registered URLs
python manage.py show_urls
```

---

## Debugging Tips

### Enable Debug Mode
```python
# In settings.py:
DEBUG = True
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

### Use Python Debugger
```python
# In your code:
import pdb; pdb.set_trace()

# In Django shell:
from pdb import set_trace
def my_function():
    set_trace()
    # Debugger will pause here
```

### View Raw SQL
```bash
python manage.py shell

from django.db import connection, reset_queries
from django.conf import settings

settings.DEBUG = True

from products.models import Product
Product.objects.all()

from django.db import connection
for query in connection.queries:
    print(query['sql'])
```

---

## Next Steps

1. **Create test data** via admin panel or management commands
2. **Test all endpoints** using Postman or cURL
3. **Set up frontend** (Phase 2) to consume this API
4. **Configure email notifications** (Phase 3)
5. **Integrate payment gateway** (Phase 4)
6. **Deploy to production** with proper security

---

## Support & Documentation

- **Django Docs**: https://docs.djangoproject.com/
- **DRF Docs**: https://www.django-rest-framework.org/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Postman**: https://www.postman.com/docs/
- **API Reference**: See `API_REFERENCE.md`
- **Database Schema**: See `DATABASE_SCHEMA.md`

---

## Success Indicators

✅ When everything is working:
- `http://localhost:8000/` loads successfully
- `http://localhost:8000/admin/` loads with login
- `http://localhost:8000/api/v1/` shows API root
- All tests pass with `python manage.py test`
- cURL requests return proper JSON responses
- Admin panel displays all models with data