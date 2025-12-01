import { Calendar, X } from 'lucide-react'
import Button from './Button'

interface DayFilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDays: string[]
  onDaysChange: (days: string[]) => void
}

function DayFilterModal({ isOpen, onClose, selectedDays, onDaysChange }: DayFilterModalProps) {
  if (!isOpen) return null

  const days = ['월', '화', '수', '목', '금', '토', '일']

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter(d => d !== day))
    } else {
      onDaysChange([...selectedDays, day])
    }
  }

  const selectAll = () => {
    onDaysChange([...days])
  }

  const resetSelection = () => {
    onDaysChange([])
  }

  const handleSearch = () => {
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border-2 border-primary rounded-lg w-full max-w-2xl p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-white" />
          <h2 className="text-2xl text-white font-bold">요일</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            size="small"
            onClick={selectAll}
          >
            전체 선택
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={resetSelection}
          >
            선택 초기화
          </Button>
        </div>

        {/* Days Section */}
        <div className="mb-8">
          <div className="flex gap-3">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`flex-1 py-4 rounded-xl font-medium transition-all text-lg ${
                  selectedDays.includes(day)
                    ? 'bg-primary text-dark'
                    : 'bg-transparent border-2 border-gray-700 text-white hover:border-primary'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="medium"
            onClick={handleSearch}
          >
            검색
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DayFilterModal
