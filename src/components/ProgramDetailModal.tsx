import { useState, useEffect, useRef } from 'react'
import { X, Calendar, Clock, User, CreditCard, MapPin, TrainFront, BusFront, Navigation } from 'lucide-react'
import Button from './Button'
import { fetchProgramDetail } from '../services/api'

interface TransportData {
  transportType: string
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

    const loadProgramDetail = async () => {
      setIsLoading(true)
      try {        const response = await fetchProgramDetail(programId)
        const apiData = response.data
        
        // API 응답의 transportData를 TransportData로 변환 (transportTime을 문자열로)
        const transformedTransportData = apiData.transportData.map((item: { transportType: string; transportName: string; transportTime: number }) => ({
          transportType: item.transportType,
          transportName: item.transportName,
          transportTime: `도보 ${item.transportTime}분`
        }))
        
        setProgram({
          programId: programId,
          programName: apiData.programName,
          programTarget: apiData.programTarget,
          weekday: apiData.weekday,
          startTime: apiData.startTime,
          price: apiData.price,
          reservationUrl: apiData.reservationUrl,
          category: apiData.category,
          subCategory: apiData.subCategory,
          facility: apiData.facility,
          facilityAddress: apiData.facilityAddress,
          TransportData: transformedTransportData
        })
      } catch (error) {
        console.error('프로그램 상세 조회 실패:', error)
        setProgram(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgramDetail()
  }, [isOpen, programId])
  
  useEffect(() => {
    if (!isOpen || activeTab !== '장소 안내' || !program?.facilityAddress) return

    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current) return

      // Geocoder로 주소를 좌표로 변환
      const geocoder = new window.kakao.maps.services.Geocoder()
      
      geocoder.addressSearch(program.facilityAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(parseFloat(result[0].y), parseFloat(result[0].x))
          
          const options = {
            center: coords,
            level: 4
          }

          const map = new window.kakao.maps.Map(mapRef.current!, options)

          new window.kakao.maps.Marker({
            position: coords,
            map: map
          })
        } else {
          console.error('주소 검색 실패:', program.facilityAddress)
        }
      })
    }

    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      setTimeout(initMap, 100)
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false&libraries=services`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(initMap)
      }
      document.head.appendChild(script)
    }
  }, [isOpen, activeTab, program])
  
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
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border-2 border-primary rounded-lg w-full max-w-2xl px-4 py-6 sm:px-8 sm:py-8 lg:px-14 lg:py-10 relative max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white hover:text-primary transition-colors z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
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
            <div className="mb-4 sm:mb-6">
              <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                {program.category} / {program.subCategory}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {program.programName}
              </h2>
            </div>

        {/* Tabs */}
        <div className="flex gap-4 sm:gap-8 mb-4 sm:mb-6 border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('프로그램 소개')}
            className={`text-sm sm:text-base font-semibold pb-2 sm:pb-3 border-b-2 transition-colors ${
              activeTab === '프로그램 소개' 
                ? 'text-primary border-primary' 
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            프로그램 소개
          </button>
          <button 
            onClick={() => setActiveTab('장소 안내')}
            className={`text-sm sm:text-base font-semibold pb-2 sm:pb-3 border-b-2 transition-colors ${
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
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-10" key="program-tab">
            <div className="flex items-center gap-2 sm:gap-3">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-sm sm:text-base text-white font-bold">대상</span>
                <span className="text-sm sm:text-base text-white ml-2 sm:ml-4">{program.programTarget}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-sm sm:text-base text-white font-bold">요일</span>
                <span className="text-sm sm:text-base text-white ml-2 sm:ml-4">{program.weekday.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-sm sm:text-base text-white font-bold">시간</span>
                <span className="text-sm sm:text-base text-white ml-2 sm:ml-4">{program.startTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-sm sm:text-base text-white font-bold">장소</span>
                <span className="text-sm sm:text-base text-white ml-2 sm:ml-4">{program.facility}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-sm sm:text-base text-white font-bold">가격</span>
                <span className="text-sm sm:text-base text-white ml-2 sm:ml-4">{program.price === 0 ? '무료' : `${program.price.toLocaleString()}원`}</span>
              </div>
            </div>
          </div>
        ) : activeTab === '장소 안내' ? (
          <div className="mb-6 sm:mb-10" key="location-tab">
            {/* Kakao Map */}
            <div 
              ref={mapRef}
              key="kakao-map"
              className="w-full h-48 sm:h-64 bg-gray-800 rounded-lg mb-4 sm:mb-6 overflow-hidden"
            />

            {/* Location Details */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <span className="text-sm sm:text-base text-white font-bold">장소</span>
                    <span className="text-sm sm:text-base text-white">{program.facility}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-white">{program.facilityAddress}</div>
                </div>
              </div>              
              <div className="flex items-start gap-2 sm:gap-3">
                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                <div className="w-full">
                  <div className="text-sm sm:text-base text-white font-bold mb-1.5 sm:mb-2">가까운 대중교통</div>                  <ul className="space-y-1.5 sm:space-y-2">
                    {program.TransportData.map((transport, index) => {
                      const IconComponent = transport.transportType === '버스' ? BusFront : TrainFront
                      return (
                        <li key={index} className="flex items-center gap-2 text-xs sm:text-sm text-white">
                          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                          <span>{transport.transportName} ({transport.transportTime})</span>
                        </li>
                      )
                    })}
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
