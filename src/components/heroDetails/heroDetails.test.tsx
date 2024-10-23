import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HeroDetails from './heroDetails'
import { useGetHeroDetailsQuery } from '../../services/api'
import type { Hero } from '../../types'

vi.mock('../../services/api', () => ({
  useGetHeroDetailsQuery: vi.fn(),
}))

vi.mock('../heroGraph/heroGraph', () => ({
  default: ({ hero }: { hero: Hero }) => (
    <div data-testid="hero-graph">Graph for {hero.name}</div>
  ),
}))

describe('HeroDetails Component', () => {
  const mockHero: Hero = {
    id: 1,
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 1,
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: '',
    edited: '',
    url: '',
  }

  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: true,
      data: null,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('shows error state', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: null,
      error: new Error('Failed to load'),
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    expect(screen.getByTestId('error')).toBeInTheDocument()
  })

  it('shows no data state', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    expect(screen.getByTestId('no-data')).toBeInTheDocument()
  })

  it('renders hero details correctly', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHero,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()

    expect(screen.getByText('172 cm')).toBeInTheDocument()
    expect(screen.getByText('77 kg')).toBeInTheDocument()
    expect(screen.getByText('blond')).toBeInTheDocument()
    expect(screen.getByText('fair')).toBeInTheDocument()
    expect(screen.getByText('blue')).toBeInTheDocument()
    expect(screen.getByText('19BBY')).toBeInTheDocument()
    expect(screen.getByText('male')).toBeInTheDocument()

    expect(screen.getByTestId('hero-graph')).toBeInTheDocument()
  })

  it('closes on backdrop click', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHero,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    const overlay = screen.getByTestId('modal-overlay')
    fireEvent.click(overlay)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('closes on close button click', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHero,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('closes on Escape key press', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHero,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not close on other key press', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHero,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    fireEvent.keyDown(document, { key: 'Enter' })

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('does not close when clicking modal content', () => {
    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: mockHero,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    fireEvent.click(screen.getByText('Luke Skywalker'))

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('shows error when missing graph data', () => {
    const heroWithoutData = {
      ...mockHero,
      films: null,
      starships: null,
    }

    ;(useGetHeroDetailsQuery as any).mockReturnValue({
      isLoading: false,
      data: heroWithoutData,
      error: null,
    })

    render(<HeroDetails heroId="1" onClose={mockOnClose} />)

    expect(
      screen.getByText('Missing film or starship data for graph')
    ).toBeInTheDocument()
  })
})
