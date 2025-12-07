import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import ProgressBar from '../../components/ProgressBar'
import Button from '../../components/Button'
import { useSurveyStore } from '../../store/surveyStore'

interface Category {
  name: string
  subcategories: string[]
}

function SurveyStep4() {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const categories: Category[] = [
    {
      name: 'GX/피트니스',
      subcategories: ['GX', 'GX 기타', '단전', '서킷트레이닝', '스트레칭', '스피닝', '역도', '요가', '점핑피트니스', '줄넘기', '크로스핏', '필라테스', '헬스', '피트니스 기타']
    },
    {
      name: '수영/수중운동',
      subcategories: ['수영', '수영 기타', '아쿠아로빅']
    },
    {
      name: '구기 스포츠',
      subcategories: ['농구', '배구', '야구', '축구', '티볼']
    },
    {
      name: '댄스/체조',
      subcategories: ['댄스 기타', '라인댄스', '리듬체조', '발레', '방송댄스', '밸리댄스', '스포츠댄스', '에어로빅', '줌바댄스']
    },
    {
      name: '라켓/골프/타격',
      subcategories: ['골프', '뉴스포츠 기타', '당구', '라켓볼', '배드민턴', '볼링', '스쿼시', '탁구', '테니스', '피클볼']
    },
    {
      name: '레저/교육',
      subcategories: ['교육문화', '사격', '클라이밍']
    },
    {
      name: '무도/격투',
      subcategories: ['검도', '복싱', '유도', '태권도', '택견', '펜싱', '무도기타']
    },
    {
      name: '빙상/보드/스케이트',
      subcategories: ['빙상 기타', '스케이트보드', '스피드스케이팅', '인라인스케이트', '피겨스케이팅']
    }
  ]

  const toggleCategory = (subcategory: string) => {
    if (selectedCategories.includes(subcategory)) {
      setSelectedCategories(selectedCategories.filter(c => c !== subcategory))
    } else {
      setSelectedCategories([...selectedCategories, subcategory])
    }
  }

  const toggleExpand = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryName))
    } else {
      setExpandedCategories([...expandedCategories, categoryName])
    }
  }

  const selectAllInCategory = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    if (!category) return

    const allSelected = category.subcategories.every(sub => 
      selectedCategories.includes(sub)
    )

    if (allSelected) {
      // 모두 선택되어 있으면 해제
      setSelectedCategories(
        selectedCategories.filter(c => !category.subcategories.includes(c))
      )
    } else {
      // 일부만 선택되어 있거나 선택 안되어 있으면 전체 선택
      const newSelections = [...selectedCategories]
      category.subcategories.forEach(sub => {
        if (!newSelections.includes(sub)) {
          newSelections.push(sub)
        }
      })
      setSelectedCategories(newSelections)
    }
  }

  const clearAllSelections = () => {
    setSelectedCategories([])
  }

  const handleSubmit = () => {
    if (selectedCategories.length > 0) {
      useSurveyStore.getState().setFavorites(selectedCategories)
      
      // 전체 설문 데이터 가져오기
      const surveyData = useSurveyStore.getState().getSurveyData()
      console.log('설문 완료:', surveyData)
      
      // TODO: API 호출하여 추천 프로그램 받아오기
      
      navigate('/programs')
    }
  }
  return (
    <div className="min-h-screen bg-dark py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar currentStep={4} totalSteps={4} />

        {/* Question */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">즐겨하는 운동을 선택해 주세요</h1>
            <p className="text-sm sm:text-base text-gray-400">관심 있는 운동을 모두 선택하면 이를 반영해서 딱 맞는 체육시설 프로그램을 추천해 드려요.</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">            {/* Left: Categories Accordion */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-3 lg:max-h-[600px] lg:overflow-y-auto lg:pr-4">
            {categories.map((category) => (
              <div key={category.name} className="border-2 border-gray-700 rounded-lg overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleExpand(category.name)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">{category.name}</span>
                  {expandedCategories.includes(category.name) ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  )}
                </button>

                {/* Subcategories Grid */}
                {expandedCategories.includes(category.name) && (
                  <div className="p-3 sm:p-4 bg-gray-900/30">
                    {/* Select All Button */}
                    <div className="mb-2 sm:mb-3">
                      <button
                        onClick={() => selectAllInCategory(category.name)}
                        className={`py-2 sm:py-3 px-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
                          category.subcategories.every(sub => selectedCategories.includes(sub))
                            ? 'border-primary bg-primary/10 text-white font-semibold'
                            : 'border-gray-700 hover:border-gray-600 text-gray-300'
                        }`}
                      >
                        {category.subcategories.every(sub => selectedCategories.includes(sub))
                          ? '전체 해제'
                          : '전체 선택'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => toggleCategory(subcategory)}
                          className={`py-2 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all text-xs sm:text-sm ${
                            selectedCategories.includes(subcategory)
                              ? 'border-primary bg-primary/10 text-white font-semibold'
                              : 'border-gray-700 hover:border-gray-600 text-gray-300'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>            {/* Right: Selected Items (Sticky) */}
            <div className="lg:sticky lg:top-0 lg:self-start">
              <div className="border-2 border-primary rounded-lg p-3 sm:p-4 bg-gray-900">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-primary font-semibold text-sm sm:text-base">{selectedCategories.length}개 선택됨</p>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={clearAllSelections}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-600 text-gray-300 hover:border-primary hover:text-primary transition-all text-xs sm:text-sm"
                      >
                        전체 초기화
                      </button>
                    )}
                  </div>
                  
                  {/* Selected Items */}
                  {selectedCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[300px] sm:max-h-[500px] overflow-y-auto pr-2">
                      {selectedCategories.map((category) => (
                        <div
                          key={category}
                          className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/20 border border-primary rounded-full text-white text-xs sm:text-sm"
                        >
                          <span className="leading-none">{category}</span>
                          <button
                            onClick={() => toggleCategory(category)}
                            className="hover:text-primary transition-colors"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm">선택된 운동이 없습니다</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              size="medium"
              onClick={() => navigate('/survey/step3')}
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleSubmit}
              disabled={selectedCategories.length === 0}
            >
              완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyStep4
