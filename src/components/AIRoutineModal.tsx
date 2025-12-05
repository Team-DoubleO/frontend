import { useState } from 'react'
import { X, Sparkles, Edit, User, MapPin } from 'lucide-react'
import { useSurveyStore } from '../store/surveyStore'
import Button from './Button'
import { generateAIRoutine } from '../services/api'
import type { AIRoutineResponse } from '../services/api'
import loadingImage from '../assets/loading.png'

interface AIRoutineModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalState = 'input' | 'loading' | 'result'

function AIRoutineModal({ isOpen, onClose }: AIRoutineModalProps) {
  const { gender, age, favorites, weekday, startTime } = useSurveyStore()
  const [height, setHeight] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [modalState, setModalState] = useState<ModalState>('input')
  const [routineData, setRoutineData] = useState<AIRoutineResponse['data'] | null>(null)

  const handleGenerate = async () => {
    if (!height || !weight) {
      alert('키와 몸무게를 입력해주세요.')
      return
    }

    setModalState('loading')

    try {
      const response = await generateAIRoutine({
        gender: gender === 'MALE' ? '남성' : '여성',
        age,
        latitude: 37.5665,
        longitude: 126.9780,
        favorites,
        height: parseInt(height),
        weight: parseInt(weight),
        weekday,
        startTime,
      })

      setRoutineData(response.data)
      setModalState('result')
    } catch (error) {
      console.error('AI 루틴 생성 실패:', error)
      setModalState('input')
    }
  }

  const handleReset = () => {
    setModalState('input')
    setHeight('')
    setWeight('')
    setRoutineData(null)
  }

  if (!isOpen) return null

  // 로딩 화면
  if (modalState === 'loading') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-dark rounded-xl w-full max-w-2xl p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">운동 루틴을 생성중입니다</h2>
          <p className="text-gray-400 text-lg mb-8">조금만 기다려주세요...</p>
          <div className="relative w-64 h-64 mb-8">
            <img 
              src={loadingImage} 
              alt="Loading" 
              className="w-full h-full object-contain animate-bounce"
            />
          </div>
        </div>
      </div>
    )
  }

  // 결과 화면
  if (modalState === 'result' && routineData) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-dark border-2 border-primary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-primary text-sm mb-2">{routineData.planRange}</div>
                <h2 className="text-2xl font-bold text-white mb-2">Weekly Workout Recap</h2>
                <p className="text-gray-400">{routineData.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-primary transition-colors ml-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-dark text-sm">📋</span>
                </div>
                <h3 className="text-white font-bold text-lg">SCHEDULE</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-sm mb-1">목표</div>
                  <div className="text-white font-bold">{routineData.focus}</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold text-xl">주 {routineData.targetSessions}회 {routineData.totalMinutes}분</div>
                </div>
              </div>
            </div>

            {/* Schedule List */}
            <div className="space-y-4 mb-6">
              {routineData.schedule.map((item, index) => (
                <div key={index} className="bg-gray-900 border-2 border-primary rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    {/* Day & Time */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 border-2 border-primary rounded-full flex flex-col items-center justify-center">
                        <div className="text-white font-bold text-lg">{item.dayKo}</div>
                        <div className="text-gray-400 text-sm">{item.time}</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="inline-block bg-primary text-dark text-sm font-bold px-3 py-1 rounded-full mb-2">
                        {item.type}
                      </div>
                      <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {item.place}
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gray-800 border border-primary/50 rounded-full text-white text-sm">
                          {item.distanceWalk}
                        </span>
                        <span className="px-3 py-1 bg-gray-800 border border-primary/50 rounded-full text-white text-sm">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="large"
                onClick={handleReset}
                className="flex-1"
              >
                다운로드
              </Button>
              <Button
                variant="primary"
                size="large"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <span>카카오톡 공유하기</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 입력 화면
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-primary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="bg-gray-900 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-bold text-white">AI 운동 루틴 생성하기</h2>
            </div>
            <button
                onClick={onClose}
                className="text-white hover:text-primary transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
          </div>
          {/* User Info Display */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-white" />
              <h3 className="font-bold text-xl text-white">사용자 정보</h3>
            </div>
            <div className="space-y-4 sm:px-2">
              {/* 성별 */}
              <div className="flex items-center gap-3 text-white">
                <span className="font-bold text-lg whitespace-nowrap">성별</span>
                <span className="text-lg">{gender === 'MALE' ? '남성' : '여성'}</span>
              </div>

              {/* 나이 */}
              <div className="flex items-center gap-3 text-white">
                <span className="font-bold text-lg whitespace-nowrap">나이</span>
                <span className="text-lg">{age}</span>
              </div>

              {weekday && weekday.length > 0 && (
                <div className="flex items-start gap-3 text-white">
                  <span className="font-bold text-lg whitespace-nowrap">요일</span>
                  <span className="text-lg">{weekday.join(', ')}</span>
                </div>
              )}

              {startTime && startTime.length > 0 && (
                <div className="flex items-start gap-3 text-white">
                  <span className="font-bold text-lg whitespace-nowrap">시간대</span>
                  <span className="text-lg">{startTime.join(', ')}</span>
                </div>
              )}

              {/* 선호 종목 */}
              <div>
                <h3 className="font-bold text-lg text-white mb-3">선호 종목</h3>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((sport) => (
                    <span
                      key={sport}
                      className="px-4 py-2 bg-primary/10 border border-primary rounded-full text-white text-sm"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-6"></div>

          {/* Additional Info Input */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Edit className="w-6 h-6 text-white" />
              <h3 className="font-bold text-xl text-white">추가 정보 입력하기</h3>
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* 키 입력 */}
              <div className="w-full">
                <label className="block text-white text-lg font-bold mb-2 ml-1">키</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="숫자만 입력해 주세요 (예: 160)"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* 몸무게 입력 */}
              <div className="w-full">
                <label className="block text-white text-lg font-bold mb-2 ml-1">몸무게</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="숫자만 입력해 주세요 (예: 50)"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleGenerate}
                  disabled={!height || !weight}
                >
                  생성하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIRoutineModal
