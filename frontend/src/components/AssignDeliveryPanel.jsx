import React, { useState } from 'react'
import { useOrders } from '../context/OrderContext'
import Spinner from './Spinner'

export default function AssignDeliveryPanel() {
  const { assignResult, clearAssignResult, runAssignDelivery } = useOrders()

  const [maxDistance, setMaxDistance] = useState('')
  const [error, setError] = useState('')
  const [assigning, setAssigning] = useState(false)

  const handleAssign = async () => {
    setError('')
    clearAssignResult()

    const val = parseFloat(maxDistance)

    if (!maxDistance || isNaN(val) || val <= 0) {
      setError('Enter valid distance > 0')
      return
    }

    setAssigning(true)
    await runAssignDelivery(val)
    setAssigning(false)
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-5">

      <h3 className="text-xl font-bold">Assign Delivery</h3>

      <div>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
          placeholder="Max Distance (km)"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <button
        onClick={handleAssign}
        disabled={assigning}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
      >
        {assigning ? <Spinner size="sm" /> : 'Dispatch Nearest'}
      </button>

      {assignResult && (
        <div
          className={`p-4 rounded-lg border ${
            assignResult.assigned
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
          }`}
        >
          {assignResult.assigned ? (
            <div className="space-y-2">
              <p className="font-semibold text-green-600">
                Dispatched #{assignResult.order.orderId}
              </p>
              <p>{assignResult.order.restaurantName}</p>
              <p>{assignResult.order.deliveryDistance} km</p>
            </div>
          ) : (
            <p className="text-red-500">
              No eligible order found
            </p>
          )}
        </div>
      )}
    </div>
  )
}