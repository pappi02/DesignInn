# DesignInn Development Setup Guide

## 🎯 Quick Start (15 Minutes)

This guide will get you up and running with DesignInn development environment in 15 minutes.

---

## Prerequisites

### System Requirements
- **macOS/Linux/Windows** (WSL2 for Windows)
- **Node.js** 16+ & npm 8+
- **Python** 3.9+
- **Git**
- **PostgreSQL** 12+ (local or connection string)

### Verify Installations
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
python --version  # Should be 3.9+
git --version     # Should be installed
```

---

## Step 1: Setup Backend (Django)

### 1.1 Navigate to Backend Directory
```bash
cd /workspaces/DesignInn/backend
```

### 1.2 Create Python Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

**Verify activation** (you should see `(venv)` in your terminal)

### 1.3 Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

This installs:
- Django 4.2
- Django REST Framework
- PostgreSQL adapter
- Cloudinary support
- Testing tools
- Code quality tools

### 1.4 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (local PostgreSQL)
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=designinn_db
DATABASE_USER=designinn_user
DATABASE_PASSWORD=secure_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# You can use SQLite for initial development
# DATABASE_ENGINE=django.db.backends.sqlite3
# DATABASE_NAME=db.sqlite3

CLOUDINARY_CLOUD_NAME=demo  # Use demo for testing
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 1.5 Setup Database

#### Option A: PostgreSQL (Recommended)
```bash
# Create database and user (in PostgreSQL)
createdb designinn_db
createuser designinn_user
# Set password and permissions in PostgreSQL

# Navigate to Django project
cd core

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Enter: username, email, password
```

#### Option B: SQLite (Quick Testing)
```bash
cd core
python manage.py migrate
python manage.py createsuperuser
```

### 1.6 Run Development Server
```bash
# From core directory
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
```

✅ **Backend is now running!**
- API: http://localhost:8000/api/v1/
- Admin: http://localhost:8000/admin/

---

## Step 2: Setup Frontend (React)

### 2.1 Open New Terminal Window
Keep the Django server running and open a new terminal.

### 2.2 Navigate to Frontend Directory
```bash
cd /workspaces/DesignInn/frontend
```

### 2.3 Install Dependencies
```bash
npm install
```

This installs:
- React 18
- Vite
- Tailwind CSS
- Router, Axios, and utilities
- Development tools

⏳ This may take 2-3 minutes.

### 2.4 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=DesignInn
VITE_WHATSAPP_NUMBER=1234567890
VITE_CONTACT_EMAIL=info@designinn.com
```

### 2.5 Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

✅ **Frontend is now running!**
- Frontend: http://localhost:5173/

---

## 🎉 You're Ready!

### What's Running
| Service | URL | Status |
|---------|-----|--------|
| React App | http://localhost:5173 | ✅ |
| Django API | http://localhost:8000/api/v1 | ✅ |
| Django Admin | http://localhost:8000/admin | ✅ |

### Test the Setup

#### 1. Test Backend API
```bash
curl http://localhost:8000/api/v1/products/
```

You should get a JSON response (empty list initially).

#### 2. Login to Admin
1. Go to http://localhost:8000/admin/
2. Use superuser credentials you created
3. You should see all apps and models

#### 3. Test Frontend
1. Go to http://localhost:5173/
2. You should see the DesignInn website loading
3. (Pages may be empty initially - no data yet)

---

## 📝 Development Workflow

### Terminal Setup (Recommended)
```
┌─────────────────────────────────────────┐
│  Terminal 1: Django Server              │
│  $ python manage.py runserver           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Terminal 2: React Dev Server           │
│  $ npm run dev                          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Terminal 3: Git / Commands             │
│  $ git status                           │
└─────────────────────────────────────────┘
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "[PHASE-#] feat: description"

# Push to remote
git push origin feature/feature-name

# Create Pull Request on GitHub
```

### Code Changes Auto-Reload
- ✅ **Django**: Auto-reloads when Python files change
- ✅ **React**: Hot Module Replacement (HMR) - instant updates
- ✅ **Tailwind**: Watches CSS changes

---

## 🆘 Troubleshooting

### Backend Issues

#### Port 8000 Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
python manage.py runserver 8001
```

#### Database Connection Error
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list               # macOS

# Test connection
psql -U designinn_user -d designinn_db -h localhost
```

#### Module Not Found Error
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall requirements
pip install -r requirements.txt
```

### Frontend Issues

#### Port 5173 Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

#### API Connection Error
```bash
# Verify .env has correct API URL
cat .env | grep VITE_API_URL

# Check if Django is running
curl http://localhost:8000/
```

#### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

### 1. Create Sample Data
```bash
# In backend/core directory
python manage.py shell

# Then in Python shell:
from products.models import Category, Product
Category.objects.create(name="T-Shirts", slug="t-shirts")
# Add more data as needed
```

### 2. Explore Django Admin
- Go to http://localhost:8000/admin/
- Add sample products, categories
- This helps test the frontend

### 3. Start Development
- Implement features from IMPLEMENTATION_TODO.md
- Commit regularly with meaningful messages
- Test API endpoints with Postman or curl

### 4. Read Documentation
- Backend: [backend/README.md](../backend/README.md)
- Frontend: [frontend/README.md](../frontend/README.md)
- Architecture: [docs/ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🛠️ Useful Commands

### Django Commands
```bash
cd backend/core

# Database
python manage.py migrate
python manage.py makemigrations
python manage.py sqlmigrate <app> <migration>

# Admin
python manage.py createsuperuser
python manage.py changepassword <username>

# Utilities
python manage.py shell
python manage.py dbshell
python manage.py dumpdata > backup.json
python manage.py loaddata backup.json

# Testing
pytest
pytest --cov

# Code Quality
black core/
flake8 core/
isort core/
```

### React Commands
```bash
cd frontend

# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build

# Quality
npm run lint         # Lint code
npm run format       # Format with Prettier

# Testing
npm run test         # Run tests
npm run test:ui      # UI test runner
npm run test:coverage # Coverage report
```

---

## 🔗 Useful Resources

### Documentation
- [Django Docs](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL GUI
- [VS Code](https://code.visualstudio.com/) - Recommended editor

### Extensions (VS Code)
- ES7+ React/Redux/React-Native snippets
- Python
- Django
- Tailwind CSS IntelliSense
- REST Client

---

## ✅ Development Checklist

- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] .env files configured
- [ ] Database migrations applied
- [ ] Superuser created
- [ ] Django server running on :8000
- [ ] Frontend dependencies installed
- [ ] Frontend .env configured
- [ ] React dev server running on :5173
- [ ] Able to access API and admin
- [ ] Sample data created (optional)

---

## 📞 Need Help?

If you encounter issues:
1. Check error message carefully
2. Search [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Review relevant documentation
4. Contact development team

---

**Happy coding! 🚀**

