import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./components/heroesList/heroesList', () => ({
  default: () => <div data-testid="mocked-heroes-list">Mocked Heroes List</div>,
}))

describe('App Component', () => {
  it('renders main container with correct classes', () => {
    render(<App />)

    const mainElement = screen.getByRole('main')
    expect(mainElement).toBeInTheDocument()
    expect(mainElement).toHaveClass(
      'min-h-screen',
      'bg-gray-800',
      'w-full',
      'p-4',
      'overflow-y-auto'
    )
  })

  it('renders mocked HeroesList component', () => {
    render(<App />)

    const mockedList = screen.getByTestId('mocked-heroes-list')
    expect(mockedList).toBeInTheDocument()

    const allMockedLists = screen.getAllByTestId('mocked-heroes-list')
    expect(allMockedLists).toHaveLength(1)
  })
})
