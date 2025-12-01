import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import swimmingImg from '../assets/swimming.png'
import tabletennisImg from '../assets/tabletennis.png'
import zumbadanceImg from '../assets/zumbadance.png'

function HomePage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const images = [
    { src: tabletennisImg, alt: '탁구' },
    { src: swimmingImg, alt: '수영' },
    { src: zumbadanceImg, alt: '줌바댄스' }
  ]

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // 5초마다 자동 전환

    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                당신에게 꼭 맞는 운동 프로그램,
                <br />
                지금 바로 FitFinder에서 찾아보세요
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                FitFinder는 몇 가지 간단한 설문을 통해 당신의 취향과
                <br />
                라이프스타일에 꼭 맞는 최적의 체육시설 프로그램을 추천해 드립니다.
              </p>
            </div>
            
            <Button 
              variant="primary" 
              size="large"
              onClick={() => navigate('/survey/step1')}
            >
              설문조사 시작하기
            </Button>
          </div>

          {/* Right Carousel */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden relative">
              {/* Images */}
              {images.map((image, index) => (
                <img 
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
