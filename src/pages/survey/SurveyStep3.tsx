import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Loader } from 'lucide-react'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'
import { useSurveyStore } from '../../store/surveyStore'

function SurveyStep3() {
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const kakaoMapRef = useRef<kakao.maps.Map | null>(null)
  const markerRef = useRef<kakao.maps.Marker | null>(null)

  // 좌표로 주소 가져오기
  const getAddressFromCoords = (lat: number, lng: number) => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      const geocoder = new window.kakao.maps.services.Geocoder()
      
      geocoder.coord2Address(lng, lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const addr = result[0].address.address_name
          setAddress(addr)
          setSelectedLocation(addr)
        } else {
          setAddress('주소를 가져올 수 없습니다')
        }
      })
    }
  }

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setCurrentPosition(pos)
          getAddressFromCoords(pos.lat, pos.lng)
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error)
          // 기본 위치 (서울시청)
          const defaultPos = { lat: 37.5665, lng: 126.9780 }
          setCurrentPosition(defaultPos)
          getAddressFromCoords(defaultPos.lat, defaultPos.lng)
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Kakao Maps 스크립트 로드
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setMapLoaded(true)
      })
      return
    }

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`
    script.async = true
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true)
      })
    }

    script.onerror = () => {
      console.error('Kakao Maps 스크립트 로드 실패')
      setLoading(false)
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (!currentPosition || !mapRef.current || !mapLoaded) return
    if (!window.kakao || !window.kakao.maps) return

    try {
      const container = mapRef.current
      const options = {
        center: new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
        level: 3,
        draggable: true,
        scrollwheel: true,
        disableDoubleClick: false,
        disableDoubleClickZoom: false
      }

      // 기존 지도가 있으면 재사용, 없으면 새로 생성
      if (!kakaoMapRef.current) {
        kakaoMapRef.current = new window.kakao.maps.Map(container, options)
      } else {
        // 기존 지도의 중심만 이동
        const moveLatLng = new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng)
        kakaoMapRef.current.setCenter(moveLatLng)
      }

      // 마커 추가 또는 업데이트
      const markerPosition = new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng)
      
      if (!markerRef.current) {
        markerRef.current = new window.kakao.maps.Marker({
          position: markerPosition,
          map: kakaoMapRef.current
        })

        // 지도 클릭/터치 이벤트 (한 번만 등록)
        window.kakao.maps.event.addListener(kakaoMapRef.current, 'click', (mouseEvent: kakao.maps.event.MouseEvent) => {
          const latlng = mouseEvent.latLng
          
          // 현재 위치 업데이트
          setCurrentPosition({
            lat: latlng.getLat(),
            lng: latlng.getLng()
          })
          
          // 마커 위치 변경
          if (markerRef.current) {
            markerRef.current.setPosition(latlng)
          }
          
          // 주소 가져오기
          getAddressFromCoords(latlng.getLat(), latlng.getLng())
        })
      } else {
        markerRef.current.setPosition(markerPosition)
      }

      setLoading(false)
    } catch (error) {
      console.error('지도 초기화 오류:', error)
      setLoading(false)
    }
  }, [currentPosition, mapLoaded])

  const handleNext = () => {
    if (selectedLocation && currentPosition) {
      useSurveyStore.getState().setLocation(currentPosition.lat, currentPosition.lng)
      navigate('/survey/step4')
    }
  }

  return (
    <div className="min-h-screen bg-dark py-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={3} totalSteps={4} />

        {/* Question */}
        <div className="space-y-4 sm:space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">선호 위치를 선택해 주세요</h1>
            <p className="text-sm sm:text-base text-gray-400">입력한 위치를 바탕으로 가까운 체육시설 프로그램을 추천해 드려요.</p>
          </div>

          {/* Map */}
          <div className="relative -mx-4 sm:mx-0">
            <div 
              ref={mapRef} 
              className="w-[100vw] sm:w-full h-[35vh] max-h-[350px] sm:h-[500px] bg-gray-800 sm:rounded-lg overflow-hidden touch-none"
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                  <div className="text-center space-y-4">
                    <Loader className="w-16 h-16 text-primary mx-auto animate-spin" />
                    <p className="text-gray-400">현재 위치를 불러오는 중...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current Location Display */}
          {address && (
            <div className="p-3 sm:p-4 bg-gray-800 rounded-lg space-y-1.5 sm:space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-gray-400 text-xs sm:text-sm">현재 선택된 위치</span>
              </div>
              <p className="text-white text-sm sm:text-base font-medium">{address}</p>
              <p className="text-gray-500 text-xs sm:text-sm">지도를 클릭하여 다른 위치를 선택할 수 있습니다</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 sm:pt-8 pb-4">
            <Button
              variant="outline"
              size="medium"
              onClick={() => navigate('/survey/step2')}
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleNext}
              disabled={!selectedLocation}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyStep3
