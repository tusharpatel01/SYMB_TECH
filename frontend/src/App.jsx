import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { OrderProvider } from './context/OrderContext.jsx'
import Navbar from './components/Navbar.jsx'
import AddOrderForm from './components/AddOrderForm.jsx'
import OrderList from './components/OrderList.jsx'
import FilterPanel from './components/FilterPanel.jsx'

const TABS = {
  add: AddOrderForm,
  orders: OrderList,
  filter: FilterPanel,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('orders')
  const ActiveView = TABS[activeTab]

  return (
    <OrderProvider>
      <div className="min-h-screen bg-gray-50">

        <Navbar active={activeTab} setActive={setActiveTab} />

        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <ActiveView />
        </main>

      </div>

      <Toaster position="bottom-right" />
    </OrderProvider>
  )
}