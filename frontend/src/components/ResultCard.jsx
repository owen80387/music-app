import React from 'react'
import { useCoins } from '../hooks/useCoins.js'
import { Music, Zap, DollarSign, ShoppingCart } from 'lucide-react'

function ResultCard({ result, onBuy }) {
  const { coins, changeCoins } = useCoins()
  
  if (!result) return null

  const handleBuy = () => {
    const price = 10 // Fixed price for now
    if (coins >= price) {
      changeCoins(-price)
      
      // Credit demoSeller with 80%
      const sellerEarnings = Math.floor(price * 0.8)
      
      // Add to history
      const transaction = {
        id: Date.now(),
        type: 'purchase',
        bpm: result.bpm,
        key: result.key,
        price: price,
        sellerEarnings: sellerEarnings,
        timestamp: new Date().toISOString(),
        audioUrl: result.audioUrl || ''
      }
      
      const history = JSON.parse(localStorage.getItem('history') || '[]')
      history.unshift(transaction)
      localStorage.setItem('history', JSON.stringify(history))
      
      onBuy(transaction)
    }
  }

  const price = 10
  const canAfford = coins >= price

  return (
    <div className="animate-slide-up bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Music className="w-6 h-6 text-primary-500 mr-2" />
        <h3 className="text-lg font-semibold">Analysis Results</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Zap className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">BPM</span>
          </div>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{result.bpm}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Music className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Key</span>
          </div>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{result.key}</p>
        </div>
      </div>
      
      {result.recommend && result.recommend.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">Recommended Beats</h4>
          <div className="space-y-2">
            {result.recommend.map((beatId, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm">Beat #{beatId}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Compatible</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm font-medium">Price: {price} coins</span>
          </div>
          <span className="text-xs text-gray-500">demoSeller gets {Math.floor(price * 0.8)} coins</span>
        </div>
        
        <button
          onClick={handleBuy}
          disabled={!canAfford}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            canAfford
              ? 'bg-primary-500 hover:bg-primary-600 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {canAfford ? 'Buy Analysis' : 'Insufficient Coins'}
        </button>
      </div>
    </div>
  )
}

export default ResultCard 