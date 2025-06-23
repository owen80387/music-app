import { useState, useEffect } from 'react'

export function useCoins() {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('userCoins')
    return saved ? parseInt(saved) : 100 // Start with 100 coins
  })

  useEffect(() => {
    localStorage.setItem('userCoins', coins.toString())
  }, [coins])

  const changeCoins = (amount) => {
    setCoins(prev => Math.max(0, prev + amount))
  }

  return { coins, changeCoins }
} 