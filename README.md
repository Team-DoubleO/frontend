# FitFinder

> 당신에게 꼭 맞는 체육시설 프로그램을 찾아드립니다

[![Deployment](https://img.shields.io/badge/deployment-live-brightgreen)](https://sspots.site/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-purple)](https://vitejs.dev/)

## 🎯 프로젝트 소개

FitFinder는 사용자의 취향과 라이프스타일을 분석하여 최적의 체육시설 프로그램을 추천하는 웹 애플리케이션입니다.

**배포 URL**: [https://sspots.site/](https://sspots.site/)

## ✨ 주요 기능

### 📋 설문조사 시스템
- **4단계 설문**: 성별, 연령대, 위치, 선호 운동 종목
- **카카오맵 연동**: 실시간 위치 기반 추천
- **카테고리 선택**: 8개 대분류, 56개 소분류 운동 종목

### 🔍 프로그램 검색 및 필터링
- **무한 스크롤**: 페이지네이션 기반 효율적인 데이터 로딩
- **실시간 필터**: 요일, 시간대별 프로그램 필터링
- **상세 정보**: 프로그램별 상세 정보 및 위치 안내
- **카카오맵 연동**: 시설 위치 및 대중교통 정보 제공
- **거리 기반 정렬**: 사용자 위치 기반 가까운 시설부터 표시

### 🤖 AI 운동 루틴 생성
- **개인 맞춤 루틴**: 키, 몸무게 입력 기반 AI 추천
- **주간 스케줄**: 7일간의 맞춤 운동 계획 제공
- **상세 정보**: 운동 종류, 시간, 장소, 거리, 태그 정보
- **이미지 내보내기**: 생성된 루틴을 이미지로 저장


### 🎨 사용자 경험
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다크 모드**: 눈의 피로를 줄이는 다크 테마
- **직관적인 UI**: 사용자 친화적인 인터페이스
- **애니메이션 효과**: 부드러운 전환 및 로딩 상태 표시

## 🛠 기술 스택

### Frontend
- **React 19.2.0** - UI 라이브러리
- **TypeScript 5.9.3** - 타입 안정성
- **Vite 7.2.4** - 빌드 도구
- **React Router DOM 7.9.6** - 클라이언트 라우팅
- **Tailwind CSS 4.1.17** - 스타일링
- **Zustand 5.0.9** - 상태 관리

### 라이브러리
- **Axios 1.13.2** - HTTP 클라이언트
- **html-to-image 1.11.13** - HTML을 이미지로 변환
- **Lucide React 0.555.0** - 아이콘 라이브러리

### 외부 API
- **Kakao Maps API** - 지도 및 위치 서비스
- **Backend API** - 프로그램 데이터 및 AI 추천 (https://api.sspots.site)

### Deployment
- **Vercel** - 호스팅 플랫폼
- **Custom Domain** - https://sspots.site/

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치
```bash
# 저장소 클론
git clone https://github.com/Team-DoubleO/frontend.git
cd frontend

# 의존성 설치
npm install
```

### 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:
```env
VITE_KAKAO_APP_KEY=your_kakao_app_key
```

### 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 접속

### 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 📁 프로젝트 구조

```
spots/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/          # 이미지 리소스
│   │   ├── female.png
│   │   ├── male.png
│   │   ├── loading.png
│   │   ├── swimming.png
│   │   ├── tabletennis.png
│   │   └── zumbadance.png
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DayFilterModal.tsx
│   │   ├── TimeFilterModal.tsx
│   │   ├── ProgramDetailModal.tsx
│   │   ├── AIRoutineModal.tsx
│   │   └── RoutineImageExport.tsx
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── HomePage.tsx
│   │   ├── ProgramListPage.tsx
│   │   └── survey/
│   │       ├── SurveyStep1.tsx
│   │       ├── SurveyStep2.tsx
│   │       ├── SurveyStep3.tsx
│   │       └── SurveyStep4.tsx
│   ├── routes/          # 라우팅 설정
│   │   └── index.tsx
│   ├── services/        # API 서비스
│   │   └── api.ts
│   ├── store/           # 상태 관리 (Zustand)
│   │   └── surveyStore.ts
│   ├── types/           # 타입 정의
│   │   └── kakao.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── vercel.json
```

## 🎨 디자인 시스템

### 색상
- **Primary**: `#13EC5B` - 주요 액션 및 강조
- **Dark**: `#1A1A1A` - 배경색
- **Gray Scale**: 다양한 gray 톤

### 폰트
- **Pretendard** - 한글 최적화 폰트 (100-900 weights)

### 아이콘
- **Lucide React** - 일관된 아이콘 시스템

## 🔄 상태 관리

Zustand를 사용한 설문 응답 상태 관리:
```typescript
interface SurveyState {
  gender: string          // 'M' | 'F'
  age: string            // '영유아' | '초등학생' | '중학생' | '고등학생' | '성인' | '시니어'
  latitude: number       // 위도
  longitude: number      // 경도
  favorites: string[]    // 선호 운동 종목
  weekday?: string[]     // 선택적: 요일 필터
  startTime?: string[]   // 선택적: 시간대 필터
}
```

## 🚀 배포

### Vercel 배포
프로젝트는 Vercel을 통해 자동 배포됩니다:
- **Production**: `main` 브랜치 푸시 시 자동 배포
- **Preview**: Pull Request 생성 시 미리보기 배포

### Custom Domain
- **Primary Domain**: https://sspots.site/
- **Vercel Domain**: https://frontend-uqgq.vercel.app/

## 📄 API 명세

### 설문 응답 형식
```json
{
  "gender": "M",
  "age": "성인",
  "latitude": 37.5665,
  "longitude": 126.9780,
  "favorites": ["헬스", "수영", "필라테스"],
  "weekday": ["월", "화", "수"],
  "startTime": ["12:00", "15:00"]
}
```

### 프로그램 목록 API
**Endpoint**: `POST /api/v1/programs`

**Query Parameters**:
- `pageSize`: 페이지 크기 (필수)
- `lastProgramId`: 마지막 프로그램 ID (무한 스크롤용, 선택)
- `lastDistance`: 마지막 프로그램 거리 (무한 스크롤용, 선택)

**응답 형식**:
```json
{
  "status": "SUCCESS",
  "message": "요청에 성공했습니다.",
  "data": [
    {
      "programId": 812,
      "programName": "[NEW]절자유수영12시(월~금)",
      "weekday": ["월", "화", "수", "목", "금"],
      "startTime": "12:00",
      "facility": "개운산스포츠센터",
      "category": "수영·수중운동",
      "subCategory": "수영",
      "distance": 5.428744572544062
    }
  ]
}
```

### 프로그램 상세 API
**Endpoint**: `GET /api/v1/programs/:programId`

**응답 형식**:
```json
{
  "status": "SUCCESS",
  "message": "요청에 성공했습니다.",
  "data": {
    "programName": "밸런스핏아쿠아로빅14A",
    "programTarget": "성인",
    "weekday": ["월", "수", "금"],
    "startTime": "14:00",
    "price": 0,
    "reservationUrl": "https://search.naver.com/search.naver",
    "category": "수영/수중운동",
    "subCategory": "아쿠아로빅",
    "facility": "고덕어울림수영장",
    "facilityAddress": "서울특별시 강동구 고덕로 399",
    "transportData": [
      {
        "transportType": "지하철",
        "transportName": "상일동역4번출구",
        "transportTime": 7
      }
    ]
  }
}
```

### AI 운동 루틴 생성 API
**Endpoint**: `POST /api/v1/recommend`

**요청 형식**:
```json
{
  "gender": "M",
  "age": "성인",
  "latitude": 37.5665,
  "longitude": 126.9780,
  "favorites": ["헬스", "수영"],
  "height": 175,
  "weight": 70,
  "weekday": ["월", "수", "금"],
  "startTime": ["12:00", "18:00"]
}
```

**응답 형식**:
```json
{
  "status": "SUCCESS",
  "message": "요청에 성공했습니다.",
  "data": {
    "planRange": "2025.01.20 - 2025.01.26",
    "subtitle": "균형잡힌 건강을 위한 맞춤 운동 플랜",
    "focus": "전신 근력 강화와 유산소 운동의 조화",
    "targetSessions": 5,
    "totalMinutes": 350,
    "estimatedCalories": 2100,
    "schedule": [
      {
        "dayKo": "월요일",
        "dayEn": "MON",
        "time": "18:00",
        "place": "서울체육관",
        "type": "헬스",
        "distanceWalk": "도보 15분",
        "tag": "근력"
      }
    ]
  }
}
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 👥 팀

**Team DoubleO**

- GitHub: [@Team-DoubleO](https://github.com/Team-DoubleO)
- Repository: [frontend](https://github.com/Team-DoubleO/frontend)

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 GitHub Issues를 통해 연락주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
