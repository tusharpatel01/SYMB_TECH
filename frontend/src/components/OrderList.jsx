import React, { useEffect } from 'react'
import { useOrders } from '../context/OrderContext'
import OrderCard from './OrderCard'
import Spinner from './Spinner'

export default function OrderList() {
  const { orders, loading, loadOrders } = useOrders()

  useEffect(() => {
    loadOrders({})
  }, []) // eslint-disable-line

  const paid = orders.filter((o) => o.isPaid).length
  const assigned = orders.filter((o) => o.isAssigned).length

  return (
    <section className="space-y-8">

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">All Orders</h2>

        <button
          onClick={() => loadOrders({})}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          {loading ? <Spinner size="sm" /> : 'Refresh'}
        </button>
      </div>

      {orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox label="Total" value={orders.length} />
          <StatBox label="Paid" value={paid} />
          <StatBox label="Unpaid" value={orders.length - paid} />
          <StatBox label="Assigned" value={assigned} />
        </div>
      )}

      {loading && orders.length === 0 ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No Orders Available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, i) => (
            <OrderCard key={order._id} order={order} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}