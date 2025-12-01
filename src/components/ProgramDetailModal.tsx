import { useState, useEffect, useRef } from 'react'
import { X, Calendar, Clock, User, CreditCard, MapPin, Navigation } from 'lucide-react'
import Button from './Button'

declare global {
  interface Window {
    kakao: any
  }
}

interface Program {
  id: number
  category: string
  title: string
  days: string
  time: string
  location: string
  gender?: string
  startDate?: string
  endDate?: string
  price?: string
  facilityName?: string
  address?: string
  nearbyTransport?: string[]
}

interface ProgramDetailModalProps {
  isOpen: boolean
  onClose: () => void
  program: Program | null
}

function ProgramDetailModal({ isOpen, onClose, program }: ProgramDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'프로그램 소개' | '장소 안내'>('프로그램 소개')
  const mapRef = useRef<HTMLDivElement>(null)
  
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
  
  if (!isOpen || !program) return null

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

        {/* Category and Title */}
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">
            {program.category}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {program.title}
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
                <span className="text-white ml-4">{program.gender || '성인'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">요일</span>
                <span className="text-white ml-4">{program.days}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">시간</span>
                <span className="text-white ml-4">{program.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">장소</span>
                <span className="text-white ml-4">{program.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <span className="text-white font-bold">가격</span>
                <span className="text-white ml-4">{program.price || '무료'}</span>
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
                <div>
                  <div className="text-white font-bold mb-1">장소</div>
                  <div className="text-white">{program.facilityName || '고덕어울림수영장'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <div className="text-white font-bold mb-1">위치</div>
                  <div className="text-white">{program.address || '서울특별시 강동구 고덕로 399 (고덕동, 고덕센트럴푸르지오)'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Navigation className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <div className="text-white font-bold mb-1">가까운 대중교통</div>
                  <div className="space-y-1">
                    {(program.nearbyTransport || ['상일동역4번출구_고덕진흥시장', '상일동역3.4번출구']).map((transport, index) => (
                      <div key={index} className="text-white">{transport}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={handleClose}
          >
            예약하기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProgramDetailModal
