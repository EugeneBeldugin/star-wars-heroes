import React, { useCallback } from 'react'
import { useGetHeroDetailsQuery } from '../../services/api'
import HeroGraph from '../heroGraph/heroGraph'

// Props interface for HeroDetails component
interface HeroDetailsProps {
  heroId: string
  onClose: () => void
}

// Modal component to display detailed hero information
const HeroDetails: React.FC<HeroDetailsProps> = ({ heroId, onClose }) => {
  const { data: hero, error, isLoading } = useGetHeroDetailsQuery(heroId)

  // Memoized handler for keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  // Add keyboard listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (isLoading) {
    return (
      <div className="text-center" data-testid="loading">
        Loading hero details...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500" data-testid="error">
        Error loading hero details
      </div>
    )
  }

  if (!hero) {
    return (
      <div className="text-center" data-testid="no-data">
        No hero details found
      </div>
    )
  }

  return (
    <div
      className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto"
      onClick={handleBackdropClick}
      data-testid="modal-overlay"
    >
      <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-galaxy text-amber-300">{hero.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-300">
              <span className="font-semibold text-amber-300">Height:</span>{' '}
              {hero.height} cm
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-amber-300">Mass:</span>{' '}
              {hero.mass} kg
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-amber-300">Hair color:</span>{' '}
              {hero.hair_color}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-amber-300">Skin color:</span>{' '}
              {hero.skin_color}
            </p>
          </div>
          <div>
            <p className="text-gray-300">
              <span className="font-semibold text-amber-300">Eye color:</span>{' '}
              {hero.eye_color}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-amber-300">Birth year:</span>{' '}
              {hero.birth_year}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-amber-300">Gender:</span>{' '}
              {hero.gender}
            </p>
          </div>
        </div>

        {/* Connections Graph */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 text-amber-300">
            Connections Graph
          </h3>
          {hero.films && hero.starships ? (
            <HeroGraph hero={hero} />
          ) : (
            <div className="text-center text-red-500">
              Missing film or starship data for graph
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeroDetails
