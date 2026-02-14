# DesignInn Backend - Django REST API

A professional, modern Django REST Framework API for the DesignInn design studio platform. This backend handles all business logic for products, orders, quotes, portfolio, and admin operations.

## 🎨 Project Overview

**DesignInn** is a full-service creative studio offering:
- Graphic Design Services
- Printing & Production
- Branded Merchandise
- Photography Services
- Interior & Exterior Design
- Order Management System
- Quote Request System

**Tech Stack:**
- Django 4.2+
- Django REST Framework 3.14+
- PostgreSQL
- Cloudinary (File Storage)
- Gunicorn (Production Server)

**Theme:** Black (#000000) | White (#FFFFFF) | Gold (#D4AF37)

---

## 📋 Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip (Python package manager)
- Git

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
cd /workspaces/DesignInn
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 5. Setup Database
```bash
cd core
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 6. Create Initial Data (Optional)
```bash
python manage.py shell
# Create sample data
```

### 7. Run Development Server
```bash
python manage.py runserver
```

Access the API at: `http://localhost:8000`
Access Admin Panel: `http://localhost:8000/admin`

---

## 📁 Project Structure

```
backend/
├── core/                          # Main Django project
│   ├── settings.py               # Project settings & configuration
│   ├── urls.py                   # Main URL routing
│   ├── wsgi.py                   # WSGI configuration
│   ├── asgi.py                   # ASGI configuration
│   │
│   ├── users/                    # User management app
│   │   ├── models.py            # User models
│   │   ├── serializers.py        # User serializers
│   │   ├── views.py             # User views/viewsets
│   │   ├── urls.py              # User endpoints
│   │   └── admin.py             # Admin configuration
│   │
│   ├── products/                 # Product & merchandise app
│   │   ├── models.py            # Product, Category, Variant models
│   │   ├── serializers.py        # Product serializers
│   │   ├── views.py             # Product views/viewsets
│   │   ├── urls.py              # Product endpoints
│   │   ├── filters.py           # Product filtering logic
│   │   └── admin.py             # Admin configuration
│   │
│   ├── orders/                   # Order management app
│   │   ├── models.py            # Order, OrderItem, OrderLog models
│   │   ├── serializers.py        # Order serializers
│   │   ├── views.py             # Order views/viewsets
│   │   ├── urls.py              # Order endpoints
│   │   └── admin.py             # Admin configuration
│   │
│   ├── quotes/                   # Quote request app
│   │   ├── models.py            # Quote model
│   │   ├── serializers.py        # Quote serializers
│   │   ├── views.py             # Quote views/viewsets
│   │   ├── urls.py              # Quote endpoints
│   │   └── admin.py             # Admin configuration
│   │
│   ├── portfolio/                # Portfolio showcase app
│   │   ├── models.py            # Portfolio, PortfolioImage models
│   │   ├── serializers.py        # Portfolio serializers
│   │   ├── views.py             # Portfolio views/viewsets
│   │   ├── urls.py              # Portfolio endpoints
│   │   └── admin.py             # Admin configuration
│   │
│   ├── services/                 # Services app
│   │   ├── models.py            # Service model
│   │   ├── serializers.py        # Service serializers
│   │   ├── views.py             # Service views
│   │   ├── urls.py              # Service endpoints
│   │   └── admin.py             # Admin configuration
│   │
│   ├── common/                   # Shared utilities
│   │   ├── permissions.py        # Custom permission classes
│   │   ├── pagination.py         # Custom pagination classes
│   │   ├── validators.py         # Custom validators
│   │   ├── storage.py           # Cloudinary storage config
│   │   └── utils.py             # Helper functions
│   │
│   └── manage.py                # Django management script
│
├── requirements.txt              # Python dependencies
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore configuration
├── README.md                    # This file
└── setup.py                     # Package setup (optional)
```

---

## 🔧 Configuration

### settings.py Key Configuration

#### Database
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT'),
    }
}
```

#### Cloudinary Storage
```python
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}
```

#### CORS Settings
```python
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
```

#### REST Framework
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'common.pagination.StandardPagination',
    'PAGE_SIZE': 12,
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}
```

---

## 🗄️ Database Models

### Users App
- **User** - Customer & staff information

### Products App
- **Category** - Product categories (T-shirts, Mugs, etc.)
- **Product** - Merchandise products
- **ProductVariant** - Size, color variations

### Orders App
- **Order** - Customer orders
- **OrderItem** - Items in an order
- **OrderStatusLog** - Order status history

### Quotes App
- **Quote** - Quote requests from customers

### Portfolio App
- **PortfolioProject** - Showcase projects
- **PortfolioImage** - Project images

### Services App
- **Service** - Design services offered

---

## 📡 API Endpoints

### Products
- `GET /api/v1/products/` - List all products
- `GET /api/v1/products/<id>/` - Get product details
- `GET /api/v1/categories/` - List categories
- `GET /api/v1/products/filter/` - Filter products

### Orders
- `POST /api/v1/orders/` - Create order
- `GET /api/v1/orders/<id>/` - Get order details
- `PATCH /api/v1/orders/<id>/status/` - Update order status
- `GET /api/v1/orders/track/` - Track order

### Quotes
- `POST /api/v1/quotes/` - Submit quote request
- `GET /api/v1/quotes/<id>/` - Get quote details
- `PATCH /api/v1/quotes/<id>/status/` - Update quote status

### Portfolio
- `GET /api/v1/portfolio/` - List portfolio items
- `GET /api/v1/portfolio/<id>/` - Get portfolio details
- `GET /api/v1/portfolio/filter/` - Filter by category

### Services
- `GET /api/v1/services/` - List all services

---

## 🔐 Authentication

The API uses **Token Authentication** for admin operations.

### Get Admin Token
```bash
python manage.py drf_create_token <username>
```

### Using Token in Requests
```bash
curl -H "Authorization: Token <your-token>" http://localhost:8000/api/v1/admin/endpoint/
```

---

## 📝 Environment Variables

See `.env.example` for complete list. Key variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `DEBUG` | Development mode | `True` / `False` |
| `SECRET_KEY` | Django secret | `django-insecure-...` |
| `DATABASE_NAME` | PostgreSQL DB | `designinn_db` |
| `DATABASE_USER` | PostgreSQL user | `designinn_user` |
| `DATABASE_PASSWORD` | PostgreSQL password | `secure_password` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account | `designinn` |
| `CORS_ALLOWED_ORIGINS` | Frontend URLs | `http://localhost:5173` |

---

## 🧪 Testing

### Run All Tests
```bash
pytest
```

### Run Specific Test
```bash
pytest tests/products/test_models.py
```

### Run with Coverage
```bash
pytest --cov=core --cov-report=html
```

---

## 🚢 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in .env
- [ ] Update `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set production database credentials
- [ ] Configure email service (Anymail)
- [ ] Set up Cloudinary storage
- [ ] Run migrations on production database
- [ ] Collect static files: `python manage.py collectstatic`
- [ ] Configure Gunicorn with systemd

### Deploy with Gunicorn
```bash
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Nginx Configuration
See `/docs/deployment/nginx.conf`

---

## 📚 Documentation

- [API Documentation](../docs/API.md)
- [Database Schema](../docs/DATABASE_SCHEMA.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Admin Panel Guide](../docs/ADMIN_GUIDE.md)

---

## 🛠️ Development Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Open Django shell
python manage.py shell

# Format code with Black
black core/

# Run Flake8 linting
flake8 core/

# Sort imports with isort
isort core/

# Collect static files
python manage.py collectstatic --noinput
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL service
sudo systemctl status postgresql

# Verify credentials in .env
cat .env | grep DATABASE
```

### Migration Issues
```bash
# Show migration status
python manage.py showmigrations

# Rollback specific app
python manage.py migrate products zero
```

### Cloudinary Upload Issues
- Verify API credentials
- Check file size limits
- Ensure image format is supported

---

## 📞 Support & Contact

For issues or questions:
- Email: support@designinn.com
- WhatsApp: +1234567890

---

## 📄 License

This project is proprietary to DesignInn. All rights reserved.

---

## 👨‍💻 Development Team

Built with ❤️ for DesignInn Creative Studio

