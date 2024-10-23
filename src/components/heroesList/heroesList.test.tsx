import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HeroesList from './heroesList'
import { useGetHeroesQuery } from '../../services/api'

vi.mock('../../services/api', () => ({
  useGetHeroesQuery: vi.fn(),
}))

vi.mock('../heroCard/heroCard', () => ({
  default: ({ hero, action }: any) => (
    <div data-testid={`hero-card-${hero.id}`} onClick={() => action(hero.id)}>
      {hero.name}
    </div>
  ),
}))

vi.mock('../heroDetails/heroDetails', () => ({
  default: ({ heroId, onClose }: any) => (
    <div data-testid="hero-details-modal">
      Hero Details {heroId}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

vi.mock('../jediLightsaberButton/jediLightsaberButton', () => ({
  default: ({ action, disabled, direction }: any) => (
    <button
      onClick={action}
      disabled={disabled}
      data-testid={`lightsaber-${direction || 'right'}`}
    >
      Lightsaber {direction || 'right'}
    </button>
  ),
}))

vi.mock('../heroCard/heroCardSkeleton.tsx', () => ({
  default: () => <div data-testid="hero-card-skeleton">Loading...</div>,
}))

describe('HeroesList Component', () => {
  const mockHeroesData = {
    count: 82,
    results: [
      { id: '1', name: 'Luke Skywalker' },
      { id: '2', name: 'Darth Vader' },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    ;(useGetHeroesQuery as any).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
      isFetching: false,
    })

    render(<HeroesList />)

    expect(screen.getByText('Star Wars Heroes')).toBeInTheDocument()
    expect(screen.getAllByTestId('hero-card-skeleton')).toHaveLength(10)
  })

  it('shows error state', () => {
    ;(useGetHeroesQuery as any).mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error('Failed to load'),
      isFetching: false,
    })

    render(<HeroesList />)

    expect(screen.getByText('Error loading heroes')).toBeInTheDocument()
  })

  it('renders heroes list and handles pagination', () => {
    ;(useGetHeroesQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHeroesData,
      error: null,
      isFetching: false,
    })

    render(<HeroesList />)

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('Darth Vader')).toBeInTheDocument()

    expect(screen.getByText('Page 1 of 9')).toBeInTheDocument()

    const prevButton = screen.getByTestId('lightsaber-left')
    expect(prevButton).toBeDisabled()

    const nextButton = screen.getByTestId('lightsaber-right')
    expect(nextButton).not.toBeDisabled()

    fireEvent.click(nextButton)
    expect(screen.getByText('Page 2 of 9')).toBeInTheDocument()
  })

  it('opens and closes hero details modal', () => {
    ;(useGetHeroesQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHeroesData,
      error: null,
      isFetching: false,
    })

    render(<HeroesList />)

    fireEvent.click(screen.getByTestId('hero-card-1'))
    expect(screen.getByTestId('hero-details-modal')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('hero-details-modal')).not.toBeInTheDocument()
  })

  it('handles loading state during fetch', () => {
    ;(useGetHeroesQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHeroesData,
      error: null,
      isFetching: true,
    })

    render(<HeroesList />)

    const prevButton = screen.getByTestId('lightsaber-left')
    const nextButton = screen.getByTestId('lightsaber-right')
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })
})
