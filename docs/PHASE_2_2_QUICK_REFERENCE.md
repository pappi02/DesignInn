# Phase 2.2 - Authentication Pages Quick Reference

## Pages at a Glance

| Page | Route | Type | Redirects | Key Features |
|------|-------|------|-----------|--------------|
| LoginPage | `/auth/login` | Public | /products | Email/password, remember me |
| RegisterPage | `/auth/register` | Public | /auth/login | 2-step form, validation |
| ForgotPasswordPage | `/auth/forgot-password` | Public | N/A | Email reset request |
| EmailVerificationPage | `/auth/verify-email` | Public | /auth/login | Auto-verify from token, resend |
| ProfileCompletionPage | `/auth/complete-profile` | Protected | /products | 3-step profile completion |

---

## Form Validation Patterns

### Pattern 1: Simple Single-Field Form (ForgotPasswordPage)
```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  const newErrors = {}
  
  if (!formData.email) {
    newErrors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    newErrors.email = 'Please enter a valid email'
  }
  
  if (Object.keys(newErrors).length > 0) {
    Object.keys(newErrors).forEach(field => {
      setFieldError(field, newErrors[field])
    })
    return
  }
  
  // API call
  await apiClient.post('/auth/forgot-password/', formData)
}
```

### Pattern 2: Login Form with Remember Me (LoginPage)
```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  // Validation...
  
  try {
    await useAuthStore.login({
      email: formData.email,
      password: formData.password,
    })
    
    // Save remember me
    if (formData.rememberMe) {
      localStorage.setItem('rememberEmail', formData.email)
    }
    
    navigate('/products')
    toast.success('Login successful!')
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Login failed')
    setFieldError('email', error.message)
  }
}
```

### Pattern 3: Multi-Step Form (RegisterPage, ProfileCompletionPage)
```jsx
const [step, setStep] = useState(1)

const handleNextStep = (e) => {
  e.preventDefault()
  
  // Validate current step
  let newErrors = {}
  if (step === 1) {
    newErrors = validateStep1()
  } else if (step === 2) {
    newErrors = validateStep2()
  }
  
  // Show errors or advance
  if (Object.keys(newErrors).length > 0) {
    Object.keys(newErrors).forEach(field => {
      setFieldError(field, newErrors[field])
    })
    return
  }
  
  setStep(step + 1)
}

const handleSubmit = async (e) => {
  e.preventDefault()
  // Final validation & submit
}

// Render step indicator
<ProgressBar step={step} total={3} />

// Conditional rendering
{step === 1 && <StepOne />}
{step === 2 && <StepTwo />}
{step === 3 && <StepThree />}

// Navigation buttons
<button onClick={() => setStep(step - 1)}>Back</button>
<button onClick={step < 3 ? handleNextStep : handleSubmit}>
  {step < 3 ? 'Next' : 'Submit'}
</button>
```

### Pattern 4: Two-State Form (ForgotPasswordPage, EmailVerificationPage)
```jsx
const [formSent, setFormSent] = useState(false)

return (
  <div>
    {!formSent ? (
      <FormComponent onSubmit={() => setFormSent(true)} />
    ) : (
      <SuccessComponent />
    )}
  </div>
)
```

---

## API Integration Points

### Authentication Store Methods

**useAuthStore.login(credentials)**
```javascript
// Call
const { login } = useAuthStore()
await login({
  email: 'user@example.com',
  password: 'password123'
})

// What happens internally:
// 1. POST /auth/login/ with credentials
// 2. Receives { token, user }
// 3. Stores token in localStorage
// 4. Updates Zustand auth state
// 5. Returns response
```

**useAuthStore.register(userData)**
```javascript
// Call
const { register } = useAuthStore()
await register({
  email: 'user@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  company_name: 'Acme Inc'
})

// What happens internally:
// 1. POST /auth/register/ with userData
// 2. Receives { token, user }
// 3. Stores token in localStorage
// 4. Updates Zustand auth state
// 5. Returns response
```

### Direct API Calls

**Password Reset**
```javascript
import { apiClient } from '../../api'

// Request reset
await apiClient.post('/auth/forgot-password/', {
  email: 'user@example.com'
})

// Verify token & reset password (done by backend link)
```

**Email Verification**
```javascript
// Verify email
await apiClient.post('/auth/verify-email/', {
  token: 'TOKEN_FROM_EMAIL',
  email: 'user@example.com'
})

// Resend verification
await apiClient.post('/auth/resend-verification/', {
  email: 'user@example.com'
})
```

**Profile Update**
```javascript
const { updateProfile } = useUserStore()

await apiClient.put(`/users/${user.id}/`, {
  company_name: 'Acme Inc',
  business_type: 'architect',
  street_address: '123 Main St',
  city: 'New York',
  state: 'NY',
  postal_code: '10001',
  country: 'USA',
  profile_completed: true
})

// Also update Zustand
updateProfile(profileData)
```

---

## Form Field Patterns

### Text Input with Validation
```jsx
<div>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="you@example.com"
    className={`input-styles ${errors.email ? 'border-red-500' : ''}`}
  />
  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
</div>
```

### Password Input
```jsx
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="••••••••"
    className={`input-styles ${errors.password ? 'border-red-500' : ''}`}
  />
  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
</div>
```

### Checkbox
```jsx
<div className="flex items-center">
  <input
    id="rememberMe"
    type="checkbox"
    name="rememberMe"
    checked={formData.rememberMe}
    onChange={(e) => handleChange({
      target: { name: 'rememberMe', value: e.target.checked }
    })}
    className="w-4 h-4 text-yellow-600"
  />
  <label htmlFor="rememberMe" className="ml-2 text-sm">
    Remember me
  </label>
</div>
```

### Select Dropdown
```jsx
<div>
  <label htmlFor="businessType">Business Type</label>
  <select
    id="businessType"
    name="businessType"
    value={formData.businessType}
    onChange={handleChange}
    className={`input-styles ${errors.businessType ? 'border-red-500' : ''}`}
  >
    <option value="">Select a type</option>
    <option value="architect">Architect</option>
    <option value="designer">Designer</option>
    <option value="contractor">Contractor</option>
  </select>
</div>
```

---

## Validation Functions Used

| Function | Purpose | Example |
|----------|---------|---------|
| `validateEmail(email)` | Email format | `user@example.com` |
| `validatePassword(pwd)` | Password strength | 8+ chars, letters, numbers, symbols |
| `validatePhone(phone)` | Phone format | `+1 (555) 000-0000` |
| `validateName(name)` | Name length | 2+ characters |

### Usage
```javascript
import { validateEmail, validatePassword, validatePhone, validateName } from '../../utils/validators'

// In validation function
if (!validateEmail(formData.email)) {
  newErrors.email = 'Invalid email address'
}

if (!validatePassword(formData.password)) {
  newErrors.password = 'Password must be at least 8 characters with letters, numbers, and symbols'
}

if (formData.phone && !validatePhone(formData.phone)) {
  newErrors.phone = 'Invalid phone number'
}

if (!validateName(formData.firstName)) {
  newErrors.firstName = 'Name must be at least 2 characters'
}
```

---

## State Management Integration

### Accessing Auth State
```jsx
import { useAuthStore } from '../../stores'

function LoginPage() {
  const { user, token, isLoading, error } = useAuthStore()
  const { login } = useAuthStore()
  
  // user: { id, email, first_name, last_name, phone, ... }
  // token: JWT token string
  // isLoading: boolean (true during API calls)
  // error: string or null
}
```

### Accessing User State
```jsx
import { useUserStore } from '../../stores'

function ProfilePage() {
  const { profile, addresses, favorites } = useUserStore()
  const { updateProfile, addAddress } = useUserStore()
  
  // profile: { company_name, business_type, ... }
}
```

### Form State with useForm Hook
```jsx
import { useForm } from '../../hooks'

function MyForm() {
  const { formData, errors, handleChange, setFieldError } = useForm({
    email: '',
    password: '',
  })
  
  // formData: { email: '', password: '' }
  // errors: { email?: 'error msg', password?: 'error msg' }
  // handleChange(event): Updates formData and clears that field's error
  // setFieldError(fieldName, errorMsg): Sets specific field error
}
```

---

## Navigation Patterns

### Redirect After Success
```jsx
// After successful API call
navigate('/products')  // Go to products page

// Or with delay (for user to see success message)
setTimeout(() => {
  navigate('/products')
}, 1500)
```

### Navigate to Another Auth Page
```jsx
// From LoginPage to RegisterPage
<Link to="/auth/register">Create account</Link>

// From RegisterPage to LoginPage
navigate('/auth/login')
```

### Conditional Navigation (Protected)
```jsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'

function ProfileCompletionPage() {
  const { user } = useAuthStore()
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" />
  }
  
  // Show profile form...
}
```

---

## Toast Notification Patterns

### Success
```jsx
import { toast } from 'react-toastify'

toast.success('Login successful!')
// Shows: Green notification at bottom-right, disappears in 3s
```

### Error
```jsx
toast.error('Invalid email or password')
// Shows: Red notification at bottom-right, disappears in 3s
```

### Custom Toast Options
```jsx
toast.success('Message', {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
})
```

---

## Common Error Handling

### From API Response
```jsx
try {
  await apiCall()
} catch (error) {
  // Backend validation error with field details
  if (error.response?.data?.email) {
    setFieldError('email', error.response.data.email[0])
  }
  
  // General error message
  const message = error.response?.data?.detail || 'Something went wrong'
  toast.error(message)
}
```

### Form Validation Error
```jsx
const newErrors = validateForm()
if (Object.keys(newErrors).length > 0) {
  // Set each field error
  Object.keys(newErrors).forEach((field) => {
    setFieldError(field, newErrors[field])
  })
  
  // Show toast
  toast.error('Please fix the errors above')
  
  // Stop execution
  return
}
```

---

## Testing These Forms

### Manual Testing Checklist

**LoginPage**
- [ ] Valid login works and redirects to /products
- [ ] Invalid email shows error
- [ ] Invalid password shows error
- [ ] Remember me saves email to localStorage
- [ ] Links to register and forgot-password work

**RegisterPage**
- [ ] Step 1 validation works
- [ ] Back button returns to step 1
- [ ] Next button advances to step 2
- [ ] Step 2 validation works
- [ ] Passwords must match
- [ ] Submit redirects to /auth/login
- [ ] Success toast shows

**ForgotPasswordPage**
- [ ] Email validation works
- [ ] Form switches to success state
- [ ] Resend button works
- [ ] Links to login and register work

**EmailVerificationPage**
- [ ] Auto-verification from URL works
- [ ] Manual token verification works
- [ ] Resend button works
- [ ] Auto-redirect to login works
- [ ] Manual redirect button works

**ProfileCompletionPage**
- [ ] Step validation works for each step
- [ ] Back button works
- [ ] Next button advances steps
- [ ] Business type dropdown works
- [ ] URL validation works on website
- [ ] Submit updates user profile
- [ ] Redirects to /products

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Form not submitting | Check if all required fields are valid |
| API 401 error | Token expired, user needs to login again |
| API 400 error | Check field validation, backend returned field-specific errors |
| Toast not showing | Check if ToastContainer is in main.jsx |
| Navigation not working | Check if URL matches route exactly |
| Buttons disabled always | Check isLoading state from store |
| Validation not running | Check if validators are imported correctly |

---

## Next Steps After Phase 2.2

1. **Integration Testing**: Test all forms with actual backend API
2. **Phase 2.3**: Build Header, Footer, Sidebar, and product pages
3. **Protected Routes**: Implement full route protection
4. **Session Persistence**: Test localStorage token on page refresh
5. **API Error Handling**: Implement global error interceptor
6. **Loading States**: Add skeleton loaders for slow networks

---

**Status**: Phase 2.2 Complete - All authentication pages ready for integration testing
