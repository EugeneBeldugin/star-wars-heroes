import React from 'react'
import HeroesList from './components/heroesList/heroesList'

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-800 w-full p-4 overflow-y-auto">
      <HeroesList />
    </main>
  )
}

export default App
