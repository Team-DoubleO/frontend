import { useState, useRef } from 'react'
import { X, Sparkles, Edit, User, MapPin, Calendar, Target, List, Footprints, Tag } from 'lucide-react'
import { useSurveyStore } from '../store/surveyStore'
import Button from './Button'
import { generateAIRoutine } from '../services/api'
import type { AIRoutineResponse } from '../services/api'
import loadingImage from '../assets/loading.png'
import * as htmlToImage from 'html-to-image'
import RoutineImageExport from './RoutineImageExport'

interface AIRoutineModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalState = 'input' | 'loading' | 'result'

// 대한민국 시간 기준 현재 날짜부터 일주일 뒤까지의 범위를 계산
const getKoreanDateRange = () => {
  const now = new Date()
  // 한국 시간으로 변환 (UTC+9)
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000))

  const startDate = new Date(koreaTime)
  const endDate = new Date(koreaTime)
  endDate.setDate(endDate.getDate() + 6) // 일주일 뒤 (6일 후)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

function AIRoutineModal({ isOpen, onClose }: AIRoutineModalProps) {
  const { gender, age, favorites, weekday, startTime } = useSurveyStore()
  const [height, setHeight] = useState<string>('')
  const [weight, setWeight] = useState<string>('')
  const [modalState, setModalState] = useState<ModalState>('input')
  const [routineData, setRoutineData] = useState<AIRoutineResponse['data'] | null>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const hiddenContainerRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!height || !weight) {
      alert('키와 몸무게를 입력해주세요.')
      return
    }

    setModalState('loading')

    try {
      const response = await generateAIRoutine({
        gender,
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

  const handleSaveImage = async () => {
    if (!exportRef.current || !routineData || !hiddenContainerRef.current) return

    try {
      // 캡처 전에 숨겨진 컨테이너를 보이게 함
      hiddenContainerRef.current.style.opacity = '1'
      hiddenContainerRef.current.style.position = 'absolute'
      hiddenContainerRef.current.style.left = '0'
      hiddenContainerRef.current.style.top = '0'
      hiddenContainerRef.current.style.zIndex = '-1'

      // 렌더링 대기
      await new Promise(resolve => setTimeout(resolve, 100))

      // html-to-image 사용 (foreignObject 기반으로 브라우저 렌더링과 동일한 결과)
      const dataUrl = await htmlToImage.toPng(exportRef.current, {
        backgroundColor: '#0D1117',
        pixelRatio: 2,
        width: 672,
        height: exportRef.current.offsetHeight,
      })

      // 캡처 후 다시 숨김
      hiddenContainerRef.current.style.opacity = '0'
      hiddenContainerRef.current.style.position = 'absolute'
      hiddenContainerRef.current.style.left = '-9999px'

      // 이미지 다운로드
      const link = document.createElement('a')
      link.download = `workout-routine-${new Date().getTime()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('이미지 저장 실패:', error)
      alert('이미지 저장에 실패했습니다.')
      // 에러 시에도 다시 숨김
      if (hiddenContainerRef.current) {
        hiddenContainerRef.current.style.opacity = '0'
        hiddenContainerRef.current.style.left = '-9999px'
      }
    }
  }

  if (!isOpen) return null

  // 로딩 화면
  if (modalState === 'loading') {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-gray-900 border-2 border-primary rounded-lg w-full max-w-2xl px-4 py-6 sm:px-8 sm:py-8 lg:px-14 lg:py-10 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-6 sm:mb-8">
            <img 
              src={loadingImage} 
              alt="Loading" 
              className="w-full h-full object-contain animate-bounce"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">운동 루틴을 생성중입니다</h2>
          <p className="text-gray-400 text-sm sm:text-base">조금만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  // 결과 화면
  if (modalState === 'result' && routineData) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-[#0D1117] rounded-2xl w-full max-w-xl sm:max-w-2xl max-h-[95vh] overflow-y-auto relative shadow-2xl">
          <div className="px-5 py-6 sm:px-7 sm:py-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Header with Calendar Icon */}
            <div className="mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-3 py-1.5 mb-3 border border-primary/20">
                <Calendar className="w-3.5 h-3.5 text-primary/80" />
                <span className="text-white/80 text-xs font-medium">{getKoreanDateRange()}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">
                Weekly Workout Recap
              </h2>
              <p className="text-gray-400">{routineData.subtitle}</p>
            </div>

            {/* Focus Stats Card */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl p-4 mb-5 sm:mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Target className="w-6 h-6 text-primary/80" />
                  <div>
                    <div className="text-primary/80 text-xs font-semibold tracking-wide">FOCUS</div>
                    <div className="text-white text-sm sm:text-base font-medium">{routineData.focus}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-primary/90 font-semibold text-base sm:text-lg">
                    주 {routineData.targetSessions}회 · {`${routineData.totalMinutes/routineData.targetSessions}`}분
                  </div>
                </div>
              </div>
            </div>

            {/* SCHEDULE Section */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <List className="w-4 h-4 text-white"/>
                <h3 className="text-transparent bg-white bg-clip-text font-semibold tracking-wider">SCHEDULE</h3>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {routineData.schedule.map((item, index) => {
                  // 각 카드마다 다른 색상 조합 (은은한 톤으로 조정)
                  const colorSchemes = [
                    { 
                      gradient: 'bg-gradient-to-br from-blue-400/80 to-blue-500/80',
                      bgGradient: 'bg-gradient-to-br from-blue-500/5 to-transparent',
                      border: 'border-blue-500/20',
                      hoverBorder: 'hover:border-blue-400/40',
                      badge: 'bg-gradient-to-r from-blue-400/90 to-blue-500/90',
                      iconColor: 'text-blue-400/70',
                      textColor: 'text-blue-300/70',
                      tagBorder: 'border-blue-500/15',
                      tagBg: 'bg-blue-500/10',
                      tagText: 'text-white/80',
                      tagBorder2: 'border-blue-400/25'
                    },
                    { 
                      gradient: 'bg-gradient-to-br from-cyan-400/80 to-cyan-500/80',
                      bgGradient: 'bg-gradient-to-br from-cyan-500/5 to-transparent',
                      border: 'border-cyan-500/20',
                      hoverBorder: 'hover:border-cyan-400/40',
                      badge: 'bg-gradient-to-r from-cyan-400/90 to-cyan-500/90',
                      iconColor: 'text-cyan-400/70',
                      textColor: 'text-cyan-300/70',
                      tagBorder: 'border-cyan-500/15',
                      tagBg: 'bg-cyan-500/10',
                      tagText: 'text-white/80',
                      tagBorder2: 'border-cyan-400/25'
                    },
                    { 
                      gradient: 'bg-gradient-to-br from-amber-400/80 to-amber-500/80',
                      bgGradient: 'bg-gradient-to-br from-amber-500/5 to-transparent',
                      border: 'border-amber-500/20',
                      hoverBorder: 'hover:border-amber-400/40',
                      badge: 'bg-gradient-to-r from-amber-400/90 to-amber-500/90',
                      iconColor: 'text-amber-400/70',
                      textColor: 'text-amber-300/70',
                      tagBorder: 'border-amber-500/15',
                      tagBg: 'bg-amber-500/10',
                      tagText: 'text-white/80',
                      tagBorder2: 'border-amber-400/25'
                    },
                    { 
                      gradient: 'bg-gradient-to-br from-rose-400/80 to-rose-500/80',
                      bgGradient: 'bg-gradient-to-br from-rose-500/5 to-transparent',
                      border: 'border-rose-500/20',
                      hoverBorder: 'hover:border-rose-400/40',
                      badge: 'bg-gradient-to-r from-rose-400/90 to-rose-500/90',
                      iconColor: 'text-rose-400/70',
                      textColor: 'text-rose-300/70',
                      tagBorder: 'border-rose-500/15',
                      tagBg: 'bg-rose-500/10',
                      tagText: 'text-white/80',
                      tagBorder2: 'border-rose-400/25'
                    },
                    { 
                      gradient: 'bg-gradient-to-br from-violet-400/80 to-violet-500/80',
                      bgGradient: 'bg-gradient-to-br from-violet-500/5 to-transparent',
                      border: 'border-violet-500/20',
                      hoverBorder: 'hover:border-violet-400/40',
                      badge: 'bg-gradient-to-r from-violet-400/90 to-violet-500/90',
                      iconColor: 'text-violet-400/70',
                      textColor: 'text-violet-300/70',
                      tagBorder: 'border-violet-500/15',
                      tagBg: 'bg-violet-500/10',
                      tagText: 'text-white/80',
                      tagBorder2: 'border-violet-400/25'
                    },
                  ]
                  const colors = colorSchemes[index % colorSchemes.length]
                  
                  return (
                    <div 
                      key={index} 
                      className={`${colors.bgGradient} border ${colors.border} ${colors.hoverBorder} rounded-xl p-3.5 sm:p-4 transition-all group`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Day Badge with Gradient */}
                        <div className="flex-shrink-0">
                          <div className={`${colors.gradient} rounded-lg px-3 py-3 min-w-[60px] text-center shadow-md`}>
                            <div className="text-white/70 font-medium text-xs uppercase tracking-wide">{item.dayEn}</div>
                            <div className="text-white/95 font-semibold text-sm mt-1">{item.dayKo}</div>
                            <div className="text-white/60 font-medium text-xs mt-1 border-t border-white/15 pt-1">{item.time}</div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {/* Sport Type Badge */}
                          <div className="inline-flex items-center gap-1 mb-1.5">
                            <span className={`px-3 py-1 ${colors.badge} text-white/95 text-xs rounded-full shadow-sm font-medium`}>
                              {item.type}
                            </span>
                          </div>

                          {/* Place Name */}
                          <div className="flex items-center gap-0.5 mb-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <MapPin className={`w-4 h-4 ${colors.iconColor}`} />
                            </div>
                            <h4 className={`text-white text-sm sm:text-base transition-colors font-medium`}>
                              {item.place}
                            </h4>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${colors.tagBg} border ${colors.tagBorder2} rounded-lg ${colors.tagText} text-xs`}>
                              <Footprints className="w-3 h-3" />
                              <span>{item.distanceWalk}</span>
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${colors.tagBg} border ${colors.tagBorder2} rounded-lg ${colors.tagText} text-xs`}>
                              <Tag className="w-3 h-3" />
                              <span>{item.tag}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-3">
              <Button
                variant="outline"
                size="medium"
                onClick={handleReset}
                className="flex-1"
              >
                다시 생성하기
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleSaveImage}
                className="flex-1"
              >
                이미지 저장
              </Button>
            </div>
          </div>

          {/* 숨겨진 이미지 저장용 컴포넌트 */}
          <div
            ref={hiddenContainerRef}
            style={{
              position: 'absolute',
              left: '-9999px',
              top: 0,
              opacity: 0,
              pointerEvents: 'none'
            }}
          >
            <div ref={exportRef}>
              <RoutineImageExport data={routineData} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 입력 화면
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-900 border-2 border-primary rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto relative">
        <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-14 lg:py-10">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white hover:text-primary transition-colors z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">AI 운동 루틴 생성</h2>
            <p className="text-sm sm:text-base text-gray-400">AI가 당신의 정보를 바탕으로 일주일 운동 루틴을 생성해 드려요.</p>
          </div>

          {/* User Info Display */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h3 className="font-semibold text-base sm:text-lg text-white">설문 정보</h3>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 border border-gray-700">
              {/* 성별 & 나이 */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">성별</div>
                  <div className="text-white text-sm sm:text-base">{gender}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">연령대</div>
                  <div className="text-white text-sm sm:text-base">{age}</div>
                </div>
              </div>

              {/* 요일 */}
              {weekday && weekday.length > 0 && (
                <div>
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">선호 요일</div>
                  <div className="flex flex-wrap gap-2">
                    {weekday.map((day) => (
                      <span key={day} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 rounded-lg text-white text-xs sm:text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 시간대 */}
              {startTime && startTime.length > 0 && (
                <div>
                  <div className="text-gray-400 text-xs sm:text-sm mb-2">선호 시간대</div>
                  <div className="flex flex-wrap gap-2">
                    {startTime.map((time) => (
                      <span key={time} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 rounded-lg text-white text-xs sm:text-sm">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 선호 종목 */}
              <div>
                <div className="text-gray-400 text-xs sm:text-sm mb-2">선호 종목</div>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((sport) => (
                    <span
                      key={sport}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-700 rounded-lg text-white text-xs sm:text-sm"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-6 sm:my-8"></div>

          {/* Additional Info Input */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h3 className="font-semibold text-base sm:text-lg text-white">추가 정보</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {/* 키 입력 */}
              <div>
                <label className="block text-white text-sm sm:text-base font-semibold mb-2">
                  키 (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="예: 170"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              {/* 몸무게 입력 */}
              <div>
                <label className="block text-white text-sm sm:text-base font-semibold mb-2">
                  몸무게 (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="예: 65"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:border-primary focus:outline-none transition-all"
                />
              </div>

              {/* Generate Button */}
              <div className="pt-2 sm:pt-4">
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleGenerate}
                  disabled={!height || !weight}
                  className="w-full text-sm sm:text-base"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
                  AI 루틴 생성하기
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
