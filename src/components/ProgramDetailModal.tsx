import { useState, useEffect, useRef } from 'react'
import { X, Calendar, Clock, User, CreditCard, MapPin, TrainFront, BusFront, Route, Navigation } from 'lucide-react'
import Button from './Button'
import { fetchProgramDetail } from '../services/api'
import { useSurveyStore } from '../store/surveyStore'

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
  const [activeTab, setActiveTab] = useState<'프로그램 소개' | '장소 안내' | '길찾기'>('프로그램 소개')
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const directionsMapRef = useRef<HTMLDivElement>(null)
  const { latitude: userLat, longitude: userLng } = useSurveyStore()

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

  // 길찾기 탭 지도 초기화
  useEffect(() => {
    if (!isOpen || activeTab !== '길찾기' || !program?.facilityAddress || !userLat || !userLng) return

    const initDirectionsMap = () => {
      if (!window.kakao || !window.kakao.maps || !directionsMapRef.current) return

      const geocoder = new window.kakao.maps.services.Geocoder()

      geocoder.addressSearch(program.facilityAddress, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const destLat = parseFloat(result[0].y)
          const destLng = parseFloat(result[0].x)
          const destCoords = new window.kakao.maps.LatLng(destLat, destLng)
          const originCoords = new window.kakao.maps.LatLng(userLat, userLng)

          // 두 점의 중심 계산
          const centerLat = (userLat + destLat) / 2
          const centerLng = (userLng + destLng) / 2
          const centerCoords = new window.kakao.maps.LatLng(centerLat, centerLng)

          const options = {
            center: centerCoords,
            level: 7
          }

          const map = new window.kakao.maps.Map(directionsMapRef.current!, options)

          // 출발지 마커 (파란색)
          const originMarkerImage = new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_spot.png',
            new window.kakao.maps.Size(33, 44)
          )
          new window.kakao.maps.Marker({
            position: originCoords,
            map: map,
            image: originMarkerImage,
            title: '출발지'
          })

          // 도착지 마커 (노란색)
          const destMarkerImage = new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            new window.kakao.maps.Size(24, 35)
          )
          new window.kakao.maps.Marker({
            position: destCoords,
            map: map,
            image: destMarkerImage,
            title: '도착지'
          })

          // 두 마커가 모두 보이도록 bounds 설정
          const bounds = new window.kakao.maps.LatLngBounds()
          bounds.extend(originCoords)
          bounds.extend(destCoords)
          map.setBounds(bounds)
        }
      })
    }

    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      setTimeout(initDirectionsMap, 100)
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false&libraries=services`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(initDirectionsMap)
      }
      document.head.appendChild(script)
    }
  }, [isOpen, activeTab, program, userLat, userLng])

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
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-60"
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
          <button
            onClick={() => setActiveTab('길찾기')}
            className={`text-sm sm:text-base font-semibold pb-2 sm:pb-3 border-b-2 transition-colors ${
              activeTab === '길찾기'
                ? 'text-primary border-primary'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            길찾기
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
                        <li key={index} className="flex items-center text-xs sm:text-sm text-white">
                          <span className="font-bold mr-2">{transport.transportType}</span>
                          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0 mr-1" />
                          <span>{transport.transportName} ({transport.transportTime})</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === '길찾기' ? (
          <div className="mb-4" key="directions-tab">
            {/* Directions Map */}
            <div
              ref={directionsMapRef}
              key="directions-map"
              className="w-full h-48 sm:h-64 bg-gray-800 rounded-lg mb-4 sm:mb-6 overflow-hidden"
            />

            {/* Legend */}
            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-white">출발지 (내 위치)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-xs sm:text-sm text-white">도착지</span>
              </div>
            </div>

            {/* Kakao Map Directions Button */}
            <button
              onClick={() => {
                const geocoder = new window.kakao.maps.services.Geocoder()
                geocoder.addressSearch(program.facilityAddress, (result, status) => {
                  if (status === window.kakao.maps.services.Status.OK) {
                    const destLat = result[0].y
                    const destLng = result[0].x
                    // 카카오맵 길찾기 URL (출발지 → 도착지)
                    const kakaoMapUrl = `https://map.kakao.com/link/from/내 위치,${userLat},${userLng}/to/${encodeURIComponent(program.facility)},${destLat},${destLng}`
                    window.open(kakaoMapUrl, '_blank')
                  }
                })
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-dark font-semibold rounded-full transition-colors"
            >
              <Route className="w-4 h-4" />
              카카오맵에서 상세 경로 보기
            </button>
          </div>
        ) : null}

            {/* Action Button */}
            {program && (
              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => window.open(program.reservationUrl, '_blank')}
                  className="w-full"
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
