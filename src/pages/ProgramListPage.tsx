import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Calendar, Grid3x3 } from 'lucide-react'
import Button from '../components/Button'
import DayFilterModal from '../components/DayFilterModal'
import TimeFilterModal from '../components/TimeFilterModal'
import ProgramDetailModal from '../components/ProgramDetailModal'
import { useSurveyStore } from '../store/surveyStore'

interface Program {
  id: number
  category: string
  title: string
  days: string
  time: string
  location: string
}

function ProgramListPage() {
  const navigate = useNavigate()
  const { weekday, startTime, setWeekday, setStartTime, getSurveyData } = useSurveyStore()
  const [selectedFilter, setSelectedFilter] = useState<string>('전체')
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(weekday || [])
  const [selectedTimes, setSelectedTimes] = useState<string[]>(startTime || [])
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // TODO: 실제로는 설문 결과를 기반으로 API에서 받아온 데이터 사용
  const programs: Program[] = [
    {
      id: 1,
      category: '구기',
      title: '키성장 쑥쑥 초등농구',
      days: '요일 월, 수',
      time: '시간 15:00',
      location: '장소 의왕청소년수련관체육관'
    },
    {
      id: 2,
      category: '구기',
      title: '키성장 쑥쑥 초등농구',
      days: '요일 월, 수',
      time: '시간 15:00',
      location: '장소 의왕청소년수련관체육관'
    },
    {
      id: 3,
      category: '구기',
      title: '키성장 쑥쑥 초등농구',
      days: '요일 월, 수',
      time: '시간 15:00',
      location: '장소 의왕청소년수련관체육관'
    },
    {
      id: 4,
      category: '구기',
      title: '키성장 쑥쑥 초등농구',
      days: '요일 월, 수',
      time: '시간 15:00',
      location: '장소 의왕청소년수련관체육관'
    },
    {
      id: 5,
      category: '구기',
      title: '키성장 쑥쑥 초등농구',
      days: '요일 월, 수',
      time: '시간 15:00',
      location: '장소 의왕청소년수련관체육관'
    },
    {
      id: 6,
      category: '구기',
      title: '키성장 쑥쑥 초등농구',
      days: '요일 월, 수',
      time: '시간 15:00',
      location: '장소 의왕청소년수련관체육관'
    },
  ]

  const filters = [
    { label: '전체', icon: Grid3x3 },
    { label: '요일', icon: Calendar },
    { label: '시간대', icon: Clock }
  ]

  // 필터 변경 시 API 재요청
  useEffect(() => {
    const fetchPrograms = async () => {
      setIsLoading(true)
      
      // Zustand store 업데이트
      if (selectedDays.length > 0) {
        setWeekday(selectedDays)
      } else {
        setWeekday(undefined)
      }
      
      if (selectedTimes.length > 0) {
        setStartTime(selectedTimes)
      } else {
        setStartTime(undefined)
      }
      
      // 전체 설문 데이터 가져오기
      const surveyData = getSurveyData()
      console.log('API 요청 데이터:', surveyData)
      
      // TODO: 실제 API 호출
      
      setIsLoading(false)
    }
    
    fetchPrograms()
  }, [selectedDays, selectedTimes])

  const handleFilterClick = (label: string) => {
    if (label === '요일') {
      setIsDayModalOpen(true)
    } else if (label === '시간대') {
      setIsTimeModalOpen(true)
    } else {
      setSelectedFilter(label)
      // 전체를 선택하면 요일/시간대 필터 초기화
      if (label === '전체') {
        setSelectedDays([])
        setSelectedTimes([])
      }
    }
  }

  const filteredPrograms = selectedFilter === '전체' 
    ? programs 
    : programs.filter(p => p.category === selectedFilter)

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">체육시설 프로그램 추천</h1>
          <p className="text-gray-400">설문조사를 바탕으로 딱 맞는 체육시설 프로그램을 찾아왔어요.</p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-3">
            {filters.map((filter) => {
              const Icon = filter.icon
              const hasAnyFilter = selectedDays.length > 0 || selectedTimes.length > 0
              
              let isActive = false
              if (filter.label === '전체') {
                isActive = selectedFilter === '전체' && !hasAnyFilter
              } else if (filter.label === '요일') {
                isActive = selectedDays.length > 0
              } else if (filter.label === '시간대') {
                isActive = selectedTimes.length > 0
              } else {
                isActive = selectedFilter === filter.label
              }
              
              return (
                <Button
                  key={filter.label}
                  variant={isActive ? 'primary' : 'outline'}
                  size="medium"
                  onClick={() => handleFilterClick(filter.label)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </Button>
              )
            })}
          </div>

          {/* Selected Filters Display */}
          {(selectedDays.length > 0 || selectedTimes.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {selectedDays.length > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary rounded-lg text-white text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>요일: {selectedDays.join(', ')}</span>
                </div>
              )}
              {selectedTimes.length > 0 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary rounded-lg text-white text-sm">
                  <Clock className="w-4 h-4" />
                  <span>시간: {selectedTimes.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Modals */}
        <DayFilterModal
          isOpen={isDayModalOpen}
          onClose={() => setIsDayModalOpen(false)}
          selectedDays={selectedDays}
          onDaysChange={setSelectedDays}
        />
        <TimeFilterModal
          isOpen={isTimeModalOpen}
          onClose={() => setIsTimeModalOpen(false)}
          selectedTimes={selectedTimes}
          onTimesChange={setSelectedTimes}
        />
        <ProgramDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          program={selectedProgram}
        />

        {/* Programs Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 text-lg">프로그램을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                onClick={() => handleProgramClick(program)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-primary/50 transition-all cursor-pointer"
              >
                {/* Category Badge */}
                <div className="inline-block bg-primary/80 text-dark text-sm font-semibold px-3 py-1 rounded-full mb-3">
                  {program.category}
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-bold mb-3">{program.title}</h3>

                {/* Details */}
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{program.days}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{program.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{program.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="medium"
            onClick={() => navigate('/')}
          >
            처음으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProgramListPage
