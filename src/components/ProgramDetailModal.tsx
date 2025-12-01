import { useState, useEffect, useRef } from 'react'
import { X, Calendar, Clock, User, CreditCard, MapPin, Train } from 'lucide-react'
import Button from './Button'

declare global {
  interface Window {
    kakao: any
  }
}

interface TransportData {
  transportName: string
  transportTime: string
}

interface Program {
  programId: number
  programName: string
  programTarget: string
  weekday: string[]
  startTime: string
  price: number
  reservationUrl: string
  category: string
  subCategory: string
  facility: string
  facilityAddress: string
  TransportData: TransportData[]
}

interface ProgramDetailModalProps {
  isOpen: boolean
  onClose: () => void
  programId: number | null
}

function ProgramDetailModal({ isOpen, onClose, programId }: ProgramDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'프로그램 소개' | '장소 안내'>('프로그램 소개')
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // 프로그램 상세 정보 가져오기
  useEffect(() => {
    if (!isOpen || !programId) return

    const fetchProgramDetail = async () => {
      setIsLoading(true)
      try {
        // TODO: 실제 API 호출
        
        // 임시 데이터 (실제로는 API 응답 사용)
        setTimeout(() => {
          setProgram({
            programId: programId,
            programName: '밸런스핏아쿠아로빅14A',
            programTarget: '성인',
            weekday: ['월', '수', '금'],
            startTime: '14:00',
            price: 0,
            reservationUrl: 'https://search.naver.com/search.naver',
            category: '수영·수중운동',
            subCategory: '아쿠아로빅',
            facility: '고덕어울림수영장',
            facilityAddress: '서울특별시 강동구 고덕로 399 (고덕동, 고덕센트럴푸르지오)',
            TransportData: [
              {
                transportName: '상일동역4번출구, 고덕전통시장',
                transportTime: '도보 7분'
              },
              {
                transportName: '상일동역3,4번출구',
                transportTime: '도보 10분'
              }
            ]
          })
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('프로그램 상세 조회 실패:', error)
        setIsLoading(false)
      }
    }

    fetchProgramDetail()
  }, [isOpen, programId])
  
  useEffect(() => {
    if (!isOpen || activeTab !== '장소 안내') return

    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current) return

      const lat = 37.5550
      const lng = 127.1547

      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3
      }

      const map = new window.kakao.maps.Map(mapRef.current, options)

      const markerPosition = new window.kakao.maps.LatLng(lat, lng)
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      })
      marker.setMap(map)
    }

    if (window.kakao && window.kakao.maps) {
      setTimeout(initMap, 100)
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(initMap)
      }
      document.head.appendChild(script)
    }
  }, [isOpen, activeTab])
  
  if (!isOpen) return null

  const handleClose = () => {
    setActiveTab('프로그램 소개')
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border-2 border-primary rounded-lg w-full max-w-2xl px-14 py-10 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 text-lg">프로그램 정보를 불러오는 중...</p>
          </div>
        ) : !program ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-400 text-lg">프로그램 정보를 찾을 수 없습니다.</p>
          </div>
        ) : (
          <>
            {/* Category and Title */}
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">
                {program.category} / {program.subCategory}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {program.programName}
              </h2>
            </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('프로그램 소개')}
            className={`font-semibold pb-3 border-b-2 transition-colors ${
              activeTab === '프로그램 소개' 
                ? 'text-primary border-primary' 
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            프로그램 소개
          </button>
          <button 
            onClick={() => setActiveTab('장소 안내')}
            className={`font-semibold pb-3 border-b-2 transition-colors ${
              activeTab === '장소 안내' 
                ? 'text-primary border-primary' 
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            장소 안내
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === '프로그램 소개' ? (
          <div className="space-y-4 mb-10" key="program-tab">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">대상</span>
                <span className="text-white ml-4">{program.programTarget}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">요일</span>
                <span className="text-white ml-4">{program.weekday.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">시간</span>
                <span className="text-white ml-4">{program.startTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">장소</span>
                <span className="text-white ml-4">{program.facility}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">가격</span>
                <span className="text-white ml-4">{program.price === 0 ? '무료' : `${program.price.toLocaleString()}원`}</span>
              </div>
            </div>
          </div>
        ) : activeTab === '장소 안내' ? (
          <div className="mb-10" key="location-tab">
            {/* Kakao Map */}
            <div 
              ref={mapRef}
              key="kakao-map"
              className="w-full h-64 bg-gray-800 rounded-lg mb-6 overflow-hidden"
            />

            {/* Location Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">장소</span>
                    <span className="text-white">{program.facility}</span>
                  </div>
                  <div className="text-white">{program.facilityAddress}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Train className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div className="w-full">
                  <div className="text-white font-bold mb-2">가까운 대중교통</div>
                  <ul className="space-y-2">
                    {program.TransportData.map((transport, index) => (
                      <li key={index} className="flex items-center text-white">
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                        <span>{transport.transportName} ({transport.transportTime})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

            {/* Action Button */}
            {program && (
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => window.open(program.reservationUrl, '_blank')}
                >
                  예약하기
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProgramDetailModal
