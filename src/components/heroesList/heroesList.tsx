import React, { useState, useEffect, useMemo } from 'react'
import { useGetHeroesQuery } from '../../services/api'
import HeroDetails from '../heroDetails/heroDetails'
import HeroCard from '../heroCard/heroCard'
import JediLightsaberButton from '../jediLightsaberButton/jediLightsaberButton'
import HeroCardSkeleton from '../heroCard/heroCardSkeleton.tsx'

// Constants
const ITEMS_PER_PAGE = 10

interface HeroesListProps {}

const HeroesList: React.FC<HeroesListProps> = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)

  const {
    data,
    error,
    isLoading,
    isFetching, // Add for better loading states
  } = useGetHeroesQuery(currentPage)

  // Calculate total pages when data changes
  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE))
    }
  }, [data])

  // Memoize pagination handlers to prevent unnecessary re-renders
  const paginationHandlers = useMemo(
    () => ({
      handlePreviousPage: () => {
        if (currentPage > 1) {
          setCurrentPage((prev) => prev - 1)
        }
      },
      handleNextPage: () => {
        if (currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1)
        }
      },
      handleHeroSelect: (heroId: string) => {
        setSelectedHeroId(heroId)
      },
    }),
    [currentPage, totalPages]
  )

  // Loading states
  if (isLoading) {
    return (
      <div className="container mx-auto px-4" data-testid="heroes-list">
        <h1 className="text-3xl mb-4 font-galaxy text-center text-amber-300">
          Star Wars Heroes
        </h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, index) => (
            <li key={index}>
              <HeroCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading heroes</div>
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl mb-4 font-galaxy text-center text-amber-300">
        Star Wars Heroes
      </h1>

      {/* Heroes Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {data?.results.map((hero) => (
          <HeroCard
            key={hero.id}
            hero={hero}
            action={paginationHandlers.handleHeroSelect}
          />
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex sm:flex-row flex-col justify-between items-center mt-4 text-neutral-300">
        <JediLightsaberButton
          action={paginationHandlers.handlePreviousPage}
          direction="left"
          disabled={currentPage === 1 || isFetching}
        />
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <JediLightsaberButton
          action={paginationHandlers.handleNextPage}
          disabled={currentPage === totalPages || isFetching}
        />
      </div>

      {/* Hero Details Modal */}
      {selectedHeroId && (
        <HeroDetails
          heroId={selectedHeroId}
          onClose={() => setSelectedHeroId(null)}
        />
      )}
    </div>
  )
}

export default HeroesList
