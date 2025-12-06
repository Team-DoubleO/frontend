import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.sspots.site',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface ProgramRequest {
  gender: string
  age: string
  latitude: number
  longitude: number
  favorites: string[]
  weekday?: string[]
  startTime?: string[]
}

export interface ProgramResponse {
  status: string
  message: string
  data: {
    programId: number
    programName: string
    weekday: string[]
    startTime: string
    category: string
    subCategory: string
    facility: string
    distance: number
  }[]
}

export interface ProgramDetailResponse {
  status: string
  message: string
  data: {
    programName: string
    programTarget: string
    weekday: string[]
    startTime: string
    price: number
    reservationUrl: string
    category: string
    subCategory: string
    facility: string
    facilityAddress: string
    transportData: {
      transportType: string
      transportName: string
      transportTime: number
    }[]
  }
}

export const fetchPrograms = async (
  body: ProgramRequest,
  pageSize: number,
  lastProgramId?: number,
  lastDistance?: number
): Promise<ProgramResponse> => {
  const params: { pageSize: number; lastProgramId?: number; lastDistance?: number } = { pageSize }
  if (lastProgramId) {
    params.lastProgramId = lastProgramId
  }
  if (lastDistance !== undefined) {
    params.lastDistance = lastDistance
  }
  
  const { data } = await api.post<ProgramResponse>('/api/v1/programs', body, { params })
  return data
}

export const fetchProgramDetail = async (programId: number): Promise<ProgramDetailResponse> => {
  const { data } = await api.get<ProgramDetailResponse>(`/api/v1/programs/${programId}`)
  return data
}

export interface AIRoutineRequest {
  gender: string
  age: string
  latitude: number
  longitude: number
  favorites: string[]
  height: number
  weight: number
  weekday?: string[]
  startTime?: string[]
}

export interface AIRoutineSchedule {
  dayKo: string
  dayEn: string
  time: string
  place: string
  type: string
  distanceWalk: string
  tag: string
}

export interface AIRoutineResponse {
  status: string
  message: string
  data: {
    planRange: string
    subtitle: string
    focus: string
    targetSessions: number
    totalMinutes: number
    estimatedCalories: number
    schedule: AIRoutineSchedule[]
  }
}

export const generateAIRoutine = async (body: AIRoutineRequest): Promise<AIRoutineResponse> => {
  const { data } = await api.post<AIRoutineResponse>('/api/v1/recommend', body)
  return data
}

export default api
