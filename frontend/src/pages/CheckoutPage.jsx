import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiLock } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuthStore, useCartStore } from '../stores'
import { useForm } from '../hooks'

/**
 * CheckoutPage - Order checkout and payment
 * Features:
 * - Shipping information
 * - Billing information
 * - Payment method selection
 * - Order review
 * - Order submission
 */
function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { items, total, clearCart } = useCartStore()
  const [step, setStep] = useState(1) // 1: shipping, 2: payment, 3: review, 4: confirmation
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const shippingForm = useForm({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })

  const billingForm = useForm({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  })

  const paymentForm = useForm({
    cardName: user?.firstName + ' ' + user?.lastName || '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-4">Checkout</h1>
            <p className="text-gray-600 mb-8">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    if (
      !shippingForm.values.firstName ||
      !shippingForm.values.address ||
      !shippingForm.values.city ||
      !shippingForm.values.zipCode
    ) {
      toast.error('Please fill all required fields')
      return
    }
    if (!sameAsShipping && !validateBillingForm()) {
      return
    }
    setStep(2)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (!validatePaymentForm()) return
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Order placed successfully!')
      clearCart()
      setStep(4)
      setTimeout(() => navigate('/'), 2000)
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  const validateBillingForm = () => {
    if (
      !billingForm.values.firstName ||
      !billingForm.values.address ||
      !billingForm.values.city ||
      !billingForm.values.zipCode
    ) {
      toast.error('Please fill all billing fields')
      return false
    }
    return true
  }

  const validatePaymentForm = () => {
    if (
      !paymentForm.values.cardName ||
      !paymentForm.values.cardNumber ||
      !paymentForm.values.expiry ||
      !paymentForm.values.cvv
    ) {
      toast.error('Please fill all payment fields')
      return false
    }
    if (paymentForm.values.cardNumber.length !== 16) {
      toast.error('Card number must be 16 digits')
      return false
    }
    return true
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition mb-8"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <h1 className="text-4xl font-bold text-black mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-12">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      stepNum < step
                        ? 'bg-green-600 text-white'
                        : stepNum === step
                          ? 'bg-black text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {stepNum < step ? <FiCheck /> : stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition ${
                        stepNum < step ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Shipping */}
            {step >= 1 && (
              <div className={`mb-8 ${step !== 1 && 'opacity-50'}`}>
                <h2 className="text-2xl font-bold text-black mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4 bg-white p-6 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">First Name *</label>
                      <input
                        type="text"
                        {...shippingForm.bind('firstName')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Last Name *</label>
                      <input
                        type="text"
                        {...shippingForm.bind('lastName')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Email *</label>
                    <input
                      type="email"
                      {...shippingForm.bind('email')}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Phone *</label>
                    <input
                      type="tel"
                      {...shippingForm.bind('phone')}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Address *</label>
                    <input
                      type="text"
                      {...shippingForm.bind('address')}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">City *</label>
                      <input
                        type="text"
                        {...shippingForm.bind('city')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">State *</label>
                      <input
                        type="text"
                        {...shippingForm.bind('state')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Zip Code *</label>
                      <input
                        type="text"
                        {...shippingForm.bind('zipCode')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                  </div>

                  {/* Billing Address Different */}
                  <div className="flex items-center space-x-2 pt-4">
                    <input
                      type="checkbox"
                      checked={!sameAsShipping}
                      onChange={() => setSameAsShipping(!sameAsShipping)}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">Billing address is different</label>
                  </div>

                  {/* Billing Address Form */}
                  {!sameAsShipping && (
                    <div className="mt-6 pt-6 border-t space-y-4">
                      <h3 className="font-semibold text-black">Billing Address</h3>
                      {/* Similar form fields for billing */}
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          {...billingForm.bind('firstName')}
                          placeholder="First Name"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                        <input
                          type="text"
                          {...billingForm.bind('lastName')}
                          placeholder="Last Name"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>
                      <input
                        type="text"
                        {...billingForm.bind('address')}
                        placeholder="Address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          {...billingForm.bind('city')}
                          placeholder="City"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                        <input
                          type="text"
                          {...billingForm.bind('state')}
                          placeholder="State"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                        <input
                          type="text"
                          {...billingForm.bind('zipCode')}
                          placeholder="Zip Code"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold mt-6"
                    >
                      Continue to Payment
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step >= 2 && (
              <div className={`mb-8 ${step !== 2 && 'opacity-50'}`}>
                <h2 className="text-2xl font-bold text-black mb-6">Payment Method</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-white p-6 rounded-lg">
                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-yellow-600">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-semibold text-black">Credit/Debit Card</span>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Cardholder Name *</label>
                        <input
                          type="text"
                          {...paymentForm.bind('cardName')}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Card Number *</label>
                        <input
                          type="text"
                          {...paymentForm.bind('cardNumber')}
                          placeholder="1234 5678 9012 3456"
                          maxLength="16"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Expiry Date *</label>
                          <input
                            type="text"
                            {...paymentForm.bind('expiry')}
                            placeholder="MM/YY"
                            maxLength="5"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">CVV *</label>
                          <input
                            type="text"
                            {...paymentForm.bind('cvv')}
                            placeholder="123"
                            maxLength="4"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex space-x-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 text-black py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
                      >
                        Review Order
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Step 3: Review */}
            {step >= 3 && (
              <div className={`mb-8 ${step !== 3 && 'opacity-50'}`}>
                <h2 className="text-2xl font-bold text-black mb-6">Review Your Order</h2>
                <div className="bg-white p-6 rounded-lg space-y-6">
                  <div>
                    <h3 className="font-semibold text-black mb-2">Shipping Address</h3>
                    <p className="text-gray-700">
                      {shippingForm.values.firstName} {shippingForm.values.lastName}
                    </p>
                    <p className="text-gray-700">{shippingForm.values.address}</p>
                    <p className="text-gray-700">
                      {shippingForm.values.city}, {shippingForm.values.state} {shippingForm.values.zipCode}
                    </p>
                  </div>

                  {step === 3 && (
                    <div className="flex space-x-4 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 bg-gray-200 text-black py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold flex items-center justify-center space-x-2"
                      >
                        <FiLock size={18} />
                        <span>Place Order</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="bg-white p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-8">Thank you for your order. You will be redirected shortly.</p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-black mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-black">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-black">${(total() / 1.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-black">${(total() - total() / 1.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-black">Total</span>
                  <span className="text-2xl font-bold text-black">${total().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
