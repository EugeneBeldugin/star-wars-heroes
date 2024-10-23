import React, { useState, useEffect, useMemo } from 'react'
import { ReactFlow, Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useGetUserDataQuery } from '../../services/api'
import { ArrayOfIDs, ID } from '../../types/index.ts'

// Props interface for the HeroGraph component
interface HeroGraphProps {
  hero: {
    id: ID
    name: string
    films: ArrayOfIDs
    starships: ArrayOfIDs
  }
}

// Styles for different types of nodes
const nodeStyles = {
  hero: {
    background: '#4a4e69',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    width: 150,
  },
  film: {
    background: '#22577a',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    width: 150,
  },
  starship: {
    background: '#38a3a5',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    width: 150,
  },
} as const

// Factory functions for creating nodes
const createFilmNode = (
  film: any,
  position: { x: number; y: number }
): Node => ({
  id: `film-${film.id}`,
  position,
  data: { label: film.title },
  style: nodeStyles.film,
})

const createStarshipNode = (
  starship: any,
  position: { x: number; y: number }
): Node => ({
  id: `starship-${starship.id}`,
  position,
  data: { label: starship.name },
  style: nodeStyles.starship,
})

// Factory function for creating edges
const createEdge = (source: string, target: string): Edge => ({
  id: `edge-${source}-${target}`,
  source,
  target,
})

const HeroGraph: React.FC<HeroGraphProps> = ({ hero }) => {
  // Fetch hero's related data
  const { data, isLoading } = useGetUserDataQuery({
    heroId: hero.id,
    films: hero.films,
    starships: hero.starships,
  })

  // Create initial hero node
  const initialNodes: Node[] = useMemo(
    () => [
      {
        id: String(hero.id),
        position: { x: 0, y: 0 },
        data: { label: hero.name },
        style: nodeStyles.hero,
      },
    ],
    [hero.id, hero.name]
  )

  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>([])

  // Calculate nodes and edges based on data
  const { nodes: calculatedNodes, edges: calculatedEdges } = useMemo(() => {
    if (!data) return { nodes: initialNodes, edges: [] }

    const films = Array.isArray(data.filmsData?.results)
      ? data.filmsData.results
      : []
    const starships = Array.isArray(data.starshipsData?.results)
      ? data.starshipsData.results
      : []

    const newNodes = [...initialNodes]
    const newEdges: Edge[] = []
    const processedStarships = new Set<string>()

    // Create film nodes and their connections
    films.forEach((film, index) => {
      const filmX = index * 200 - (films.length - 1) * 100
      const filmNode = createFilmNode(film, { x: filmX, y: 100 })
      newNodes.push(filmNode)

      // Connect hero to film
      newEdges.push(createEdge(String(hero.id), filmNode.id))

      // Find and add starships for this film
      const filmStarships = starships.filter((starship) =>
        film.starships.includes(starship.id)
      )

      // Create starship nodes and their connections
      filmStarships.forEach((starship, starshipIndex) => {
        const starshipNodeId = `starship-${starship.id}`

        if (!processedStarships.has(String(starship.id))) {
          const starshipNode = createStarshipNode(starship, {
            x: filmX,
            y: 200 + starshipIndex * 100,
          })
          newNodes.push(starshipNode)
          processedStarships.add(String(starship.id))
        }

        newEdges.push({
          id: `edge-${filmNode.id}-${starshipNodeId}`,
          source: filmNode.id,
          target: starshipNodeId,
          type: 'default',
        })
      })
    })

    return { nodes: newNodes, edges: newEdges }
  }, [data, initialNodes, hero.id])

  // Update state when calculations change
  useEffect(() => {
    setNodes(calculatedNodes)
    setEdges(calculatedEdges)
  }, [calculatedNodes, calculatedEdges])

  if (isLoading) {
    return <div className="text-center p-4">Loading graph data...</div>
  }

  return (
    <div
      style={{ height: '400px', width: '100%' }}
      className="border rounded-lg"
    >
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  )
}

// Prevent unnecessary re-renders
export default React.memo(HeroGraph)
