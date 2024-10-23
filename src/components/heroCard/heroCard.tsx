import React from 'react'
import { Hero } from '../../types'

// API endpoint for character images
const IMAGE_API_PATH = 'https://starwars-visualguide.com/assets/img/characters'

type Props = {
  hero: Hero
  action: (id: string) => void
}

// Simple presentation component for displaying Star Wars character card
const HeroCard: React.FC<Props> = ({ hero, action }) => {
  const { name, id, height, mass } = hero

  // Handler for card click
  const handleClick = () => {
    action(id.toString())
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-gradient-to-r from-gray-900 to-gray-950 rounded-xl overflow-hidden shadow-lg text-amber-200"
      data-testid="hero-card" // Added for testing
    >
      <div className="p-4 flex justify-between items-start font-bold">
        {name}
      </div>

      {/* Character Image with Hover Effect */}
      <div className="h-[20rem] relative border-t-2 border-b-1 border-yellow-300 group">
        <img
          src={`${IMAGE_API_PATH}/${id}.jpg`}
          alt={name}
          className="absolute t-0 s-0 z-10 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-amber-300 bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 z-20">
          <span className="text-white font-bold text-xl [text-shadow:_2px_2px_0_rgb(234_179_8)]">
            View Details
          </span>
        </div>
      </div>

      {/* Character Stats */}
      <div className="border-t-2 border-amber-200 p-4 flex gap-6 items-center bg-gradient-to-r from-gray-900 to-gray-950 relative z-20">
        <div className="flex gap-2 items-center">
          <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-red-950 font-bold">
            H
          </span>
          <span className="text-amber-200 flex items-center justify-center font-bold">
            {height}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-red-950 font-bold">
            M
          </span>
          <span className="text-amber-200 flex items-center justify-center font-bold">
            {mass}
          </span>
        </div>
      </div>
    </div>
  )
}

export default HeroCard
