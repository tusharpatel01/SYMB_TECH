import axiosInstance from './axiosInstance'

export const fetchAllOrders = (filters = {}) => {
  const params = {}
  if (filters.isPaid !== undefined && filters.isPaid !== '')
    params.isPaid = filters.isPaid
  if (filters.maxDistance !== undefined && filters.maxDistance !== '')
    params.maxDistance = filters.maxDistance
  return axiosInstance.get('/orders', { params })
}

export const createNewOrder = (orderData) =>
  axiosInstance.post('/orders', orderData)

export const updateExistingOrder = (id, updates) =>
  axiosInstance.patch(`/orders/${id}`, updates)

export const deleteExistingOrder = (id) =>
  axiosInstance.delete(`/orders/${id}`)

export const runAssignDeliveryAPI = (maxDistance) =>
  axiosInstance.post('/orders/assign-delivery', {
    maxDistance: parseFloat(maxDistance),
  })