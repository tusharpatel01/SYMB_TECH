import React from 'react'
import { useOrders } from '../context/OrderContext'

export default function OrderCard({ order, index = 0 }) {
  const { removeOrder, togglePaidStatus } = useOrders()
  const {
    _id,
    orderId,
    restaurantName,
    itemCount,
    isPaid,
    deliveryDistance,
    isAssigned,
    createdAt,
  } = order

  const date = new Date(createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-1 ${
        isAssigned ? 'border-2 border-green-500' : ''
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div
        className={`px-4 py-2 flex justify-between items-center text-white ${
          isAssigned ? 'bg-green-600' : 'bg-black'
        }`}
      >
        <span className="text-xs font-semibold tracking-widest">
          #{orderId}
        </span>
        <span className="text-xs">
          {isAssigned ? 'DISPATCHED' : date}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-lg font-bold">{restaurantName}</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500">Items</p>
            <p className="text-xl font-semibold">{itemCount}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500">Distance</p>
            <p className="text-xl font-semibold">
              {deliveryDistance} km
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => togglePaidStatus(_id, isPaid)}
            className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${
              isPaid
                ? 'border-green-500 text-green-600 hover:bg-green-600 hover:text-white'
                : 'border-red-500 text-red-600 hover:bg-red-600 hover:text-white'
            }`}
          >
            {isPaid ? '✓ PAID' : 'UNPAID'}
          </button>

          <button
            onClick={() => removeOrder(_id)}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}