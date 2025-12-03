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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border-2 border-primary rounded-lg w-full max-w-2xl p-4 sm:p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white hover:text-primary transition-colors z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-xl sm:text-2xl text-white font-bold">요일</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
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
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-1.5 sm:gap-2 lg:gap-3">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all text-base sm:text-lg ${
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
