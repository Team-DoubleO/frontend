import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Calendar, Grid3x3 } from 'lucide-react'
import Button from '../components/Button'
import DayFilterModal from '../components/DayFilterModal'
import TimeFilterModal from '../components/TimeFilterModal'
import ProgramDetailModal from '../components/ProgramDetailModal'
import { useSurveyStore } from '../store/surveyStore'
import { fetchPrograms } from '../services/api'

interface Program {
  programId: number
  programName: string
  weekday: string[]
  startTime: string
  category: string
  subCategory: string
  facility: string
}

function ProgramListPage() {
  const navigate = useNavigate()
  const { weekday, startTime, setWeekday, setStartTime, getProgramRequest } = useSurveyStore()
  const [selectedFilter, setSelectedFilter] = useState<string>('전체')
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(weekday || [])
  const [selectedTimes, setSelectedTimes] = useState<string[]>(startTime || [])
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const filters = [
    { label: '전체', icon: Grid3x3 },
    { label: '요일', icon: Calendar },
    { label: '시간대', icon: Clock }
  ]

  // 초기 프로그램 로딩 및 필터 변경 시 재요청
  const loadPrograms = useCallback(async (reset = false) => {
    if (reset) {
      setIsLoading(true)
      setPrograms([])
      setHasMore(true)
    } else if (!hasMore || isFetchingMore) {
      return
    } else {
      setIsFetchingMore(true)
    }

    try {
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

      const lastProgramId = reset ? undefined : programs[programs.length - 1]?.programId
      const requestBody = getProgramRequest()
      const response = await fetchPrograms(requestBody, 20, lastProgramId)
      
      if (response.data.length === 0) {
        setHasMore(false)
      } else {
        setPrograms(prev => reset ? response.data : [...prev, ...response.data])
      }
    } catch (error) {
      console.error('프로그램 로딩 실패:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }, [selectedDays, selectedTimes, programs, hasMore, isFetchingMore, setWeekday, setStartTime, getProgramRequest])

  // 필터 변경 시 초기화하고 새로 로드
  useEffect(() => {
    loadPrograms(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays, selectedTimes])

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading) {
          loadPrograms(false)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, isFetchingMore, isLoading, loadPrograms])

  const handleFilterClick = (label: string) => {
    if (label === '요일') {
      setIsDayModalOpen(true)
    } else if (label === '시간대') {
      setIsTimeModalOpen(true)
    } else if (label === '전체') {
      setSelectedFilter(label)
      // 전체를 선택하면 요일/시간대 필터 초기화
      setSelectedDays([])
      setSelectedTimes([])
    }
  }

  const handleProgramClick = (programId: number) => {
    setSelectedProgramId(programId)
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
          programId={selectedProgramId}
        />

        {/* Programs Grid */}
        {isLoading && programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 text-lg">프로그램을 불러오는 중...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-lg">조건에 맞는 프로그램이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {programs.map((program) => (
                <div
                  key={program.programId}
                  onClick={() => handleProgramClick(program.programId)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-primary/50 transition-all cursor-pointer"
                >
                  {/* Category Badge */}
                  <div className="inline-block bg-primary/80 text-dark text-sm font-semibold px-3 py-1 rounded-full mb-2">
                    {program.subCategory}
                  </div>

                  {/* Title */}
                  <h3 className="text-white text-xl font-bold mb-3">{program.programName}</h3>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0 text-primary" />
                      <span className='text-white'><span className="font-bold">요일</span> {program.weekday.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                      <span className='text-white'><span className="font-bold">시간</span> {program.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
                      <span className='text-white'><span className="font-bold">장소</span> {program.facility}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              {/* Infinite Scroll Observer Target */}
            <div ref={observerTarget} className="h-20 flex items-center justify-center">
              {isFetchingMore && (
                <div className="relative w-12 h-12">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-14 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          variant="outline"
          size="medium"
          onClick={() => navigate('/')}
          className='bg-dark'
        >
          처음으로 돌아가기
        </Button>
      </div>
    </div>
  )
}

export default ProgramListPage
