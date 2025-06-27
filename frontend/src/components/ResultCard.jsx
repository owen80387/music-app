import React from 'react'
import { useCoins } from '../hooks/useCoins.js'
import { Music, Zap, DollarSign, ShoppingCart } from 'lucide-react'

function ResultCard({ result, onBuy }) {
  const { coins, changeCoins } = useCoins()
  
  if (!result) return null

  const handleBuyBeat = (beat) => {
    if (coins >= beat.price) {
      changeCoins(-beat.price)
      
      // Credit seller with 80%
      const sellerEarnings = Math.floor(beat.price * 0.8)
      
      // Add to history
      const transaction = {
        id: Date.now(),
        type: 'purchase',
        beatId: beat.id,
        seller: beat.user,
        bpm: beat.bpm,
        key: beat.key,
        similarity: beat.similarity,
        price: beat.price,
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
          <h4 className="text-md font-medium mb-3">Similar Beats from Users</h4>
          <div className="space-y-3">
            {result.recommend.map((beat, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{beat.id}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">by {beat.user}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${
                      beat.similarity >= 90 ? 'text-green-600' :
                      beat.similarity >= 70 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {beat.similarity}% match
                    </span>
                  </div>
                </div>
                                 <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                   <span>{beat.bpm} BPM • {beat.key}</span>
                   <span className="font-medium text-primary-600 dark:text-primary-400">{beat.price} coins</span>
                 </div>
                 <button
                   onClick={() => handleBuyBeat(beat)}
                   disabled={coins < beat.price}
                   className={`w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                     coins >= beat.price
                       ? 'bg-primary-500 hover:bg-primary-600 text-white'
                       : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                   }`}
                 >
                   <ShoppingCart className="w-3 h-3 mr-2" />
                   {coins >= beat.price ? `Buy for ${beat.price} coins` : 'Not enough coins'}
                 </button>
               </div>
             ))}
           </div>
         </div>
       )}
    </div>
  )
}

export default ResultCard 