import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ArrayOfIDs, Film, Hero, Starship } from '../types'

// Base interface for API responses
interface ApiResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Parameters for fetching user-related data
interface UserDataParams {
  heroId: number
  films: ArrayOfIDs
  starships: ArrayOfIDs
}

// Combined user data response type
interface UserData {
  filmsData: ApiResponse<Film>
  starshipsData: ApiResponse<Starship>
}

export const starWarsApi = createApi({
  reducerPath: 'starWarsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://sw-api.starnavi.io/' }),
  endpoints: (builder) => ({
    // Fetch paginated list of heroes
    getHeroes: builder.query<ApiResponse<Hero>, number>({
      query: (page = 1) => `people/?page=${page}`,
    }),

    // Fetch detailed information about specific hero
    getHeroDetails: builder.query<Hero, string>({
      query: (id) => `people/${id}/`,
    }),

    // Fetch combined data about hero's films and starships
    getUserData: builder.query<UserData, UserDataParams>({
      // @ts-ignore - required for multiple concurrent requests
      async queryFn(
        { heroId, films, starships },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        const filmsResponse = await fetchWithBQ(
          `films/?people__in=${heroId}&id__in=${films?.join(',')}`
        )
        const starshipsResponse = await fetchWithBQ(
          `starships/?films__in=${films?.join(',')}&id__in=${starships?.join(',')}`
        )

        if (filmsResponse.error || starshipsResponse.error) {
          return { error: 'Error fetching data' }
        }

        return {
          data: {
            filmsData: filmsResponse.data as ApiResponse<Film>,
            starshipsData: starshipsResponse.data as ApiResponse<Starship>,
          },
        }
      },
    }),
  }),
})

// Exported hooks for use in components
export const {
  useGetHeroesQuery,
  useGetHeroDetailsQuery,
  useGetUserDataQuery,
} = starWarsApi
