import React from 'react'
import HistoryTable from '../components/HistoryTable.jsx'
import { History as HistoryIcon } from 'lucide-react'

function History() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <HistoryIcon className="w-8 h-8 text-primary-500 mr-3" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Your Purchases & Sales
          </h2>
          <HistoryTable />
        </div>
      </div>
    </div>
  )
}

export default History 