import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'

function SurveyStep4() {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const categories = [
    '수영', '헬스', '요가', '필라테스',
    '탁구', '배드민턴', '농구', '축구',
    '테니스', '댄스', '클라이밍', '태권도',
    '복싱', '검도', '주짓수', '기타'
  ]

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSubmit = () => {
    if (selectedCategories.length > 0) {
      // TODO: 설문 결과 제출 및 결과 페이지로 이동
      console.log('설문 완료:', selectedCategories)
      navigate('/programs')
    }
  }

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={4} totalSteps={4} />

        {/* Question */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">즐겨하는 운동을 선택해 주세요</h1>
            <p className="text-gray-400">관심 있는 운동을 모두 선택하면 이를 반영해서 딱 맞는 체육시설 프로그램을 추천해 드려요.</p>
          </div>

          {/* Selected Count */}
          <div className="flex items-center space-x-2">
            <span className="text-primary font-semibold">{selectedCategories.length}개 선택됨</span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-4 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`py-4 px-3 rounded-lg border-2 transition-all ${
                  selectedCategories.includes(category)
                    ? 'border-primary bg-primary/10 text-white'
                    : 'border-gray-700 hover:border-gray-600 text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              size="medium"
              onClick={() => navigate('/survey/step3')}
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleSubmit}
              disabled={selectedCategories.length === 0}
            >
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyStep4
