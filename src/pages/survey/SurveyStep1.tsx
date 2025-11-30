import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'
import maleImg from '../../assets/male.png'
import femaleImg from '../../assets/female.png'

function SurveyStep1() {
  const navigate = useNavigate()
  const [selectedGender, setSelectedGender] = useState<string>('')

  const handleNext = () => {
    if (selectedGender) {
      // TODO: 설문 데이터 저장 (Context 또는 상태 관리)
      navigate('/survey/step2')
    }
  }

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={1} totalSteps={4} />

        {/* Question */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">성별을 선택해 주세요</h1>
            <p className="text-gray-400">성별에 따라 더 정확한 체육시설 프로그램을 추천해 드립니다.</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedGender('male')}
              className={`aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-between p-6 ${
                selectedGender === 'male'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src={maleImg} alt="남성" className="w-32 h-32 object-contain" />
              </div>
              <span className="text-white text-xl font-semibold">남성</span>
            </button>

            <button
              onClick={() => setSelectedGender('female')}
              className={`aspect-square rounded-lg border-2 transition-all flex flex-col items-center justify-between p-6 ${
                selectedGender === 'female'
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex-1 flex items-center justify-center">
                <img src={femaleImg} alt="여성" className="w-32 h-32 object-contain" />
              </div>
              <span className="text-white text-xl font-semibold">여성</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              size="medium"
              onClick={() => navigate('/')}
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleNext}
              disabled={!selectedGender}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyStep1
