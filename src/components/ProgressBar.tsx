interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">
          설문 {currentStep}/{totalSteps}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  )
}

export default ProgressBar
