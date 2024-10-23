// Base types

export type ID = number
export type ArrayOfIDs = ID[]

// Main interfaces

export interface Hero {
  birth_year: string
  created: string
  edited: string
  eye_color: string
  films: ArrayOfIDs
  gender: string
  hair_color: string
  height: string
  homeworld: number
  id: ID
  mass: string
  name: string
  skin_color: string
  species: ArrayOfIDs
  starships: ArrayOfIDs
  url: string
  vehicles: ArrayOfIDs
}

export interface Film {
  characters: ArrayOfIDs
  created: string
  director: string
  edited: string
  episode_id: number
  id: ID
  opening_crawl: string
  planets: ArrayOfIDs
  producer: string
  release_date: string
  species: ArrayOfIDs
  starships: ArrayOfIDs
  title: string
  url: string
  vehicles: ArrayOfIDs
}

export interface Starship {
  MGLT: string
  cargo_capacity: string
  consumables: string
  cost_in_credits: string
  created: string
  crew: string
  edited: string
  films: ArrayOfIDs
  hyperdrive_rating: string
  id: ID
  length: string
  manufacturer: string
  max_atmosphering_speed: string
  model: string
  name: string
  passengers: string
  pilots: ArrayOfIDs
  starship_class: string
  url: string
}
