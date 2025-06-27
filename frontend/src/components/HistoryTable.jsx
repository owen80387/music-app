import React, { useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'

function HistoryTable() {
  const [history, setHistory] = useState([])
  const [playingId, setPlayingId] = useState(null)

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('history') || '[]')
    setHistory(savedHistory)
  }, [])

  const handlePlayToggle = (id, audioUrl) => {
    if (!audioUrl) return
    
    if (playingId === id) {
      setPlayingId(null)
      // In a real app, you'd pause the audio here
    } else {
      setPlayingId(id)
      // In a real app, you'd play the audio here
      // For demo purposes, we'll just toggle the state
      setTimeout(() => setPlayingId(null), 3000) // Auto-stop after 3s
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No transactions yet.</p>
        <p className="text-sm mt-1">Your purchases and sales will appear here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Beat / Seller
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price / Match
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Audio
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {formatDate(transaction.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  transaction.type === 'purchase'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <div className="font-medium">{transaction.beatId || 'Analysis'}</div>
                <div className="text-xs text-gray-500">{transaction.seller || 'System'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <div>{transaction.bpm} BPM • {transaction.key}</div>
                {transaction.similarity && (
                  <div className="text-xs text-gray-500">{transaction.similarity}% similarity</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <div>{transaction.price} coins</div>
                {transaction.sellerEarnings && (
                  <div className="text-xs text-gray-500">Seller earned: {transaction.sellerEarnings}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {transaction.audioUrl ? (
                  <button
                    onClick={() => handlePlayToggle(transaction.id, transaction.audioUrl)}
                    className="flex items-center space-x-1 text-primary-500 hover:text-primary-600"
                  >
                    {playingId === transaction.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>{playingId === transaction.id ? 'Playing' : 'Play'}</span>
                  </button>
                ) : (
                  <span className="text-gray-400">No audio</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable 