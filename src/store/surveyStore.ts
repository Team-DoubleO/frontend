import { create } from 'zustand'

interface SurveyState {
  gender: string
  age: string
  latitude: number
  longitude: number
  favorites: string[]
  weekday?: string[]
  startTime?: string[]
  setGender: (gender: string) => void
  setAge: (age: string) => void
  setLocation: (latitude: number, longitude: number) => void
  setFavorites: (favorites: string[]) => void
  setWeekday: (weekday: string[] | undefined) => void
  setStartTime: (startTime: string[] | undefined) => void
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
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  gender: '',
  age: '',
  latitude: 0,
  longitude: 0,
  favorites: [],
  weekday: undefined,
  startTime: undefined,
  
  setGender: (gender) => set({ gender }),
  setAge: (age) => set({ age }),
  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setFavorites: (favorites) => set({ favorites }),
  setWeekday: (weekday) => set({ weekday }),
  setStartTime: (startTime) => set({ startTime }),
  
  resetSurvey: () => set({
    gender: '',
    age: '',
    latitude: 0,
    longitude: 0,
    favorites: [],
    weekday: undefined,
    startTime: undefined
  }),
  
  getSurveyData: () => ({
    gender: get().gender,
    age: get().age,
    latitude: get().latitude,
    longitude: get().longitude,
    favorites: get().favorites,
    ...(get().weekday && { weekday: get().weekday }),
    ...(get().startTime && { startTime: get().startTime })
  })
}))
