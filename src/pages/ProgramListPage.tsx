import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Calendar, Grid3x3 } from 'lucide-react'
import Button from '../components/Button'
import DayFilterModal from '../components/DayFilterModal'
import TimeFilterModal from '../components/TimeFilterModal'

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
  const [selectedFilter, setSelectedFilter] = useState<string>('전체')
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])

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

  const handleFilterClick = (label: string) => {
    if (label === '요일') {
      setIsDayModalOpen(true)
    } else if (label === '시간대') {
      setIsTimeModalOpen(true)
    } else {
      setSelectedFilter(label)
    }
  }

  const filteredPrograms = selectedFilter === '전체' 
    ? programs 
    : programs.filter(p => p.category === selectedFilter)

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">체육시설 프로그램 추천</h1>
          <p className="text-gray-400">설문조사를 바탕으로 딱 맞는 체육시설 프로그램을 찾아왔어요.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <Button
                key={filter.label}
                variant={selectedFilter === filter.label ? 'primary' : 'outline'}
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

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
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
