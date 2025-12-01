import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'
import { useSurveyStore } from '../../store/surveyStore'

function SurveyStep2() {
  const navigate = useNavigate()
  const { age, setAge } = useSurveyStore()
  const [selectedAge, setSelectedAge] = useState<string>(age)

  const ageGroups = [
    '영유아', '초등학생', '중학생', '고등학생', '성인', '시니어'
  ]

  useEffect(() => {
    setSelectedAge(age)
  }, [age])

  const handleNext = () => {
    if (selectedAge) {
      setAge(selectedAge)
      navigate('/survey/step3')
    }
  }

  return (
    <div className="min-h-screen bg-dark py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={2} totalSteps={4} />

        {/* Question */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">연령대를 선택해 주세요</h1>
            <p className="text-gray-400">연령대에 맞는 최적의 체육시설 프로그램을 추천해 드립니다.</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-4">
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`py-6 px-4 rounded-lg border-2 transition-all ${
                  selectedAge === age
                    ? 'border-primary bg-primary/10 text-white'
                    : 'border-gray-700 hover:border-gray-600 text-gray-300'
                } text-lg font-semibold`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              size="medium"
              onClick={() => navigate('/survey/step1')}
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleNext}
              disabled={!selectedAge}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyStep2
