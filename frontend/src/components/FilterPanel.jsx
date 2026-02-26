import React, { useEffect } from 'react'
import { useOrders } from '../context/OrderContext'
import OrderCard from './OrderCard'
import AssignDeliveryPanel from './AssignDeliveryPanel'

export default function FilterPanel() {
  const { orders, loading, filters, setFilters, loadOrders } = useOrders()

  useEffect(() => {
    loadOrders(filters)
  }, []) // eslint-disable-line

  const handleChange = ({ target: { name, value } }) =>
    setFilters((p) => ({ ...p, [name]: value }))

  const applyFilters = () => loadOrders(filters)

  const clearFilters = () => {
    const reset = { isPaid: '', maxDistance: '' }
    setFilters(reset)
    loadOrders(reset)
  }

  return (
    <section className="space-y-8">

      <h2 className="text-3xl font-bold">Filter & Assign</h2>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-xl shadow p-6 space-y-4">

          <div>
            <label className="block text-sm mb-1">Payment Status</label>
            <select
              name="isPaid"
              value={filters.isPaid}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">All</option>
              <option value="false">Unpaid</option>
              <option value="true">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Max Distance</label>
            <input
              name="maxDistance"
              type="number"
              value={filters.maxDistance}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={applyFilters}
              disabled={loading}
              className="flex-1 bg-black text-white py-2 rounded-lg"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 border rounded-lg py-2"
            >
              Clear
            </button>
          </div>
        </div>

        <AssignDeliveryPanel />
      </div>

      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, i) => (
            <OrderCard key={order._id} order={order} index={i} />
          ))}
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          No matching orders found
        </div>
      )}

    </section>
  )
}