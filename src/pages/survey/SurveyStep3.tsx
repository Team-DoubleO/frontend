import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Loader } from 'lucide-react'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'

declare global {
  interface Window {
    kakao: any
  }
}

function SurveyStep3() {
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const kakaoMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

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
  }, [])

  // 좌표로 주소 가져오기
  const getAddressFromCoords = (lat: number, lng: number) => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      const geocoder = new window.kakao.maps.services.Geocoder()
      
      geocoder.coord2Address(lng, lat, (result: any, status: any) => {
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

  // Kakao Maps 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&libraries=services&autoload=false`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        // 스크립트 로드 완료
      })
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // 지도 초기화
  useEffect(() => {
    if (currentPosition && mapRef.current && window.kakao && window.kakao.maps) {
      const container = mapRef.current
      const options = {
        center: new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
        level: 3
      }

      kakaoMapRef.current = new window.kakao.maps.Map(container, options)

      // 마커 추가
      const markerPosition = new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng)
      markerRef.current = new window.kakao.maps.Marker({
        position: markerPosition,
        map: kakaoMapRef.current
      })

      // 지도 클릭 이벤트
      window.kakao.maps.event.addListener(kakaoMapRef.current, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng
        
        // 마커 위치 변경
        markerRef.current.setPosition(latlng)
        
        // 주소 가져오기
        getAddressFromCoords(latlng.getLat(), latlng.getLng())
      })

      setLoading(false)
    }
  }, [currentPosition])

  const handleNext = () => {
    if (selectedLocation) {
      navigate('/survey/step4')
    }
  }

  return (
    <div className="min-h-screen bg-dark py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={3} totalSteps={4} />

        {/* Question */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">선호 위치를 선택해 주세요</h1>
            <p className="text-gray-400">입력한 위치를 바탕으로 가까운 체육시설 프로그램을 추천해 드려요.</p>
          </div>

          {/* Map */}
          <div className="relative">
            <div 
              ref={mapRef} 
              className="aspect-video bg-gray-800 rounded-lg overflow-hidden"
              style={{ minHeight: '400px' }}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
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
            <div className="p-4 bg-gray-800 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-gray-400 text-sm">현재 선택된 위치</span>
              </div>
              <p className="text-white font-medium">{address}</p>
              <p className="text-gray-500 text-sm">지도를 클릭하여 다른 위치를 선택할 수 있습니다</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-8">
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
