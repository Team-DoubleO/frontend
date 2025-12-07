import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Calendar, Sliders } from 'lucide-react'
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

  const features = [
    {
      icon: Sparkles,
      title: '개인 맞춤 추천',
      description: '당신의 취향을 분석하고 꼭 맞는 운동을 찾아 드립니다.'
    },
    {
      icon: Calendar,
      title: '다양한 프로그램 정보',
      description: '헬스, 필라테스, 요가 등 원하는 모든 체육시설 프로그램 정보를 한눈에 확인하세요.'
    },
    {
      icon: Sliders,
      title: '간편한 비교와 선택',
      description: '가격, 위치, 시설 정보를 쉽게 비교하고 최적의 선택을 할 수 있습니다.'
    }
  ]

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length])
  return (
    <div className="min-h-screen bg-dark">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-24 sm:mb-32 lg:mb-48">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                당신에게 꼭 맞는 운동 프로그램,
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                지금 바로 FitFinder에서 찾아보세요
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                FitFinder는 몇 가지 간단한 설문을 통해 당신의 취향과
                <span className="hidden sm:inline"><br /></span>
                <span className="sm:hidden"> </span>
                라이프스타일에 꼭 맞는 최적의 체육시설 프로그램을 추천해 드립니다.
              </p>
            </div>
            
            <Button 
              variant="primary" 
              size="large"
              onClick={() => navigate('/survey/step1')}
              className="w-full sm:w-auto"
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
        </div>        {/* Features Section */}
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white px-2">
            <span className="text-primary">FitFinder</span>는 이렇게 다릅니다
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4">
            FitFinder는 몇 가지 간단한 질문을 통해
            <span className="hidden sm:inline"><br /></span>
            <span className="sm:hidden"> </span>
            당신의 목표와 라이프스타일에 가장 적합한 운동 프로그램을 찾아드립니다.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 FitFinder Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <button className="transition-colors">Team-DoubleO</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
