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
  }[]
}

export const fetchPrograms = async (
  body: ProgramRequest,
  pageSize: number,
  lastProgramId?: number
): Promise<ProgramResponse> => {
  const params: { pageSize: number; lastProgramId?: number } = { pageSize }
  if (lastProgramId) {
    params.lastProgramId = lastProgramId
  }
  
  const { data } = await api.post<ProgramResponse>('/api/v1/programs', body, { params })
  return data
}

export default api
