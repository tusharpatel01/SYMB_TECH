import React from 'react'

const NAV_TABS = [
  { id: 'add', label: 'NEW ORDER' },
  { id: 'orders', label: 'ALL ORDERS' },
  { id: 'filter', label: 'FILTER / ASSIGN' },
]

export default function Navbar({ active, setActive }) {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex items-center justify-between py-5 border-b border-gray-700">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Dispatch Terminal
            </p>
            <h1 className="text-3xl font-bold tracking-wider">
              DELIVERIQ
            </h1>
          </div>
          <div className="hidden sm:block text-right text-xs text-gray-400">
            {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>

        <nav className="flex">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                active === tab.id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

      </div>
    </header>
  )
}