import { create } from 'zustand'

interface SurveyState {
  gender: string
  age: string
  latitude: number
  longitude: number
  favorites: string[]
  weekday?: string[]
  startTime?: string[]
  pageSize: number
  setGender: (gender: string) => void
  setAge: (age: string) => void
  setLocation: (latitude: number, longitude: number) => void
  setFavorites: (favorites: string[]) => void
  setWeekday: (weekday: string[] | undefined) => void
  setStartTime: (startTime: string[] | undefined) => void
  setPageSize: (pageSize: number) => void
  resetSurvey: () => void
  getSurveyData: () => {
    gender: string
    age: string
    latitude: number
    longitude: number
    favorites: string[]
    weekday?: string[]
    startTime?: string[]
  }
  getProgramRequest: () => {
    gender: string
    age: string
    latitude: number
    longitude: number
    favorites: string[]
    weekday?: string[]
    startTime?: string[]
  }
  isValidSurveyData: () => boolean
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  gender: '',
  age: '',
  latitude: 0,
  longitude: 0,
  favorites: [],
  weekday: undefined,
  startTime: undefined,
  pageSize: 20,
  
  setGender: (gender) => set({ gender }),
  setAge: (age) => set({ age }),
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setFavorites: (favorites) => set({ favorites }),
  setWeekday: (weekday) => set({ weekday }),
  setStartTime: (startTime) => set({ startTime }),
  setPageSize: (pageSize) => set({ pageSize }),
  
  resetSurvey: () => set({
    gender: '',
    age: '',
    latitude: 0,
    longitude: 0,
    favorites: [],
    weekday: undefined,
    startTime: undefined,
    pageSize: 20
  }),
  
  getSurveyData: () => ({
    gender: get().gender,
    age: get().age,
    latitude: get().latitude,
    longitude: get().longitude,
    favorites: get().favorites,
    ...(get().weekday && { weekday: get().weekday }),
    ...(get().startTime && { startTime: get().startTime })
  }),
  
  getProgramRequest: () => ({
    gender: get().gender,
    age: get().age,
    latitude: get().latitude,
    longitude: get().longitude,
    favorites: get().favorites,
    ...(get().weekday && { weekday: get().weekday }),
    ...(get().startTime && { startTime: get().startTime })
  }),

  // 설문조사 필수 값 검증
  isValidSurveyData: () => {
    const state = get()
    return !!(
      state.gender && 
      state.age && 
      state.latitude !== 0 && 
      state.longitude !== 0 && 
      state.favorites.length > 0
    )
  }
}))
