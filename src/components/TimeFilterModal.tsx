import { Clock, X } from 'lucide-react'
import Button from './Button'

interface TimeFilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTimes: string[]
  onTimesChange: (times: string[]) => void
}

function TimeFilterModal({ isOpen, onClose, selectedTimes, onTimesChange }: TimeFilterModalProps) {
  if (!isOpen) return null

  const times = [
    '05:00', '06:00', '07:00', '08:00','09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ]

  const toggleTime = (time: string) => {
    if (selectedTimes.includes(time)) {
      onTimesChange(selectedTimes.filter(t => t !== time))
    } else {
      onTimesChange([...selectedTimes, time])
    }
  }

  const selectAll = () => {
    onTimesChange([...times])
  }

  const resetSelection = () => {
    onTimesChange([])
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
      <div className="bg-gray-900 border-2 border-primary rounded-lg w-full max-w-4xl p-4 sm:p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white hover:text-primary transition-colors z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-xl sm:text-2xl text-white font-bold">시간대</h2>
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

        {/* Times Section */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2 sm:gap-2.5 lg:gap-3">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => toggleTime(time)}
                className={`py-3 sm:py-3.5 lg:py-4 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base lg:text-lg ${
                  selectedTimes.includes(time)
                    ? 'bg-primary text-dark'
                    : 'bg-transparent border-2 border-gray-700 text-white hover:border-primary'
                }`}
              >
                {time}
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

export default TimeFilterModal
