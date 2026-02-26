import React, {
  createContext,
  useContext,
  useState,
  useCallback
} from 'react'
import toast from 'react-hot-toast'
import {
  fetchAllOrders,
  createNewOrder,
  updateExistingOrder,
  deleteExistingOrder,
  runAssignDeliveryAPI,
} from '../api/orderApi'

const OrderContext = createContext(null)

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    isPaid: '',
    maxDistance: ''
  })
  const [assignResult, setAssignResult] = useState(null)

  const loadOrders = useCallback(async (customFilters) => {
    setLoading(true)
    try {
      const activeFilters =
        customFilters !== undefined ? customFilters : filters

      const data = await fetchAllOrders(activeFilters)
      setOrders(data.orders)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const addOrder = async (formData) => {
    const data = await createNewOrder(formData)
    toast.success('Order logged.')
    await loadOrders()
    return data
  }

  const removeOrder = async (id) => {
    try {
      await deleteExistingOrder(id)
      setOrders((prev) =>
        prev.filter((o) => o._id !== id)
      )
      toast.success('Order removed.')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const togglePaidStatus = async (id, currentStatus) => {
    try {
      const data = await updateExistingOrder(id, {
        isPaid: !currentStatus
      })

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? data.order : o
        )
      )

      toast.success(
        !currentStatus ? 'Marked paid.' : 'Marked unpaid.'
      )
    } catch (error) {
      toast.error(error.message)
    }
  }

  const runAssignDelivery = async (maxDistance) => {
    setLoading(true)
    setAssignResult(null)

    try {
      const data = await runAssignDeliveryAPI(maxDistance)

      setAssignResult(data)

      if (data.assigned) {
        toast.success(
          `Dispatched → #${data.order.orderId}`
        )

        setOrders((prev) =>
          prev.map((o) =>
            o._id === data.order._id ? data.order : o
          )
        )
      } else {
        toast.error('No eligible orders found.')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const clearAssignResult = () => {
    setAssignResult(null)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        filters,
        setFilters,
        assignResult,
        clearAssignResult,
        loadOrders,
        addOrder,
        removeOrder,
        togglePaidStatus,
        runAssignDelivery,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error(
      'useOrders must be used within an OrderProvider'
    )
  }
  return context
}