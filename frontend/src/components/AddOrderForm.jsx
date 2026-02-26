// ONLY UI changed — logic untouched

import React, { useState } from 'react'
import { useOrders } from '../context/OrderContext'
import FormField from './FormField'
import Spinner from './Spinner'

const INITIAL_FORM = {
  orderId: '',
  restaurantName: '',
  itemCount: '',
  deliveryDistance: '',
  isPaid: false,
}

const validateForm = (f) => {
  const e = {}
  if (!f.orderId.trim()) e.orderId = 'Required'
  if (!f.restaurantName.trim()) e.restaurantName = 'Required'
  if (!f.itemCount || parseInt(f.itemCount) < 1)
    e.itemCount = 'Must be ≥ 1'
  if (!f.deliveryDistance || parseFloat(f.deliveryDistance) <= 0)
    e.deliveryDistance = 'Must be > 0 km'
  return e
}

export default function AddOrderForm() {
  const { addOrder } = useOrders()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setSubmitting(true)
    try {
      await addOrder({
        orderId: form.orderId.trim(),
        restaurantName: form.restaurantName.trim(),
        itemCount: parseInt(form.itemCount),
        deliveryDistance: parseFloat(form.deliveryDistance),
        isPaid: form.isPaid,
      })
      setForm(INITIAL_FORM)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-3xl mx-auto">

      <h2 className="text-3xl font-bold mb-8">New Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <FormField label="Order ID" error={errors.orderId} required>
          <input
            name="orderId"
            value={form.orderId}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />
        </FormField>

        <FormField label="Restaurant" error={errors.restaurantName} required>
          <input
            name="restaurantName"
            value={form.restaurantName}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Items" error={errors.itemCount} required>
            <input
              name="itemCount"
              type="number"
              min="1"
              value={form.itemCount}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </FormField>

          <FormField label="Distance (km)" error={errors.deliveryDistance} required>
            <input
              name="deliveryDistance"
              type="number"
              min="0.1"
              step="0.1"
              value={form.deliveryDistance}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
            />
          </FormField>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isPaid"
            checked={form.isPaid}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Payment Received</span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          {submitting ? <Spinner size="sm" /> : 'Log Order'}
        </button>

      </form>
    </div>
  )
}