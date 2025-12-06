import type { AIRoutineResponse } from '../services/api'

interface RoutineImageExportProps {
  data: AIRoutineResponse['data']
}

// SVG 아이콘들 (lucide-react와 동일한 크기로)
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
)

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
)

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const FootprintsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"></path>
    <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"></path>
  </svg>
)

const TagIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
    <path d="M7 7h.01"></path>
  </svg>
)

// 대한민국 시간 기준 현재 날짜부터 일주일 뒤까지의 범위를 계산
const getKoreanDateRange = () => {
  const now = new Date()
  // 한국 시간으로 변환 (UTC+9)
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000))

  const startDate = new Date(koreaTime)
  const endDate = new Date(koreaTime)
  endDate.setDate(endDate.getDate() + 6) // 일주일 뒤 (6일 후)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

function RoutineImageExport({ data }: RoutineImageExportProps) {
  // 색상 스킴 (AIRoutineModal과 동일)
  const colorSchemes = [
    {
      gradient: 'linear-gradient(to bottom right, rgba(96, 165, 250, 0.8), rgba(59, 130, 246, 0.8))',
      bgGradient: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), transparent)',
      border: 'rgba(59, 130, 246, 0.2)',
      badge: 'linear-gradient(to right, rgba(96, 165, 250, 0.9), rgba(59, 130, 246, 0.9))',
      iconColor: 'rgba(96, 165, 250, 0.7)',
      tagBg: 'rgba(59, 130, 246, 0.1)',
      tagBorder: 'rgba(96, 165, 250, 0.25)'
    },
    {
      gradient: 'linear-gradient(to bottom right, rgba(34, 211, 238, 0.8), rgba(6, 182, 212, 0.8))',
      bgGradient: 'linear-gradient(to bottom right, rgba(6, 182, 212, 0.05), transparent)',
      border: 'rgba(6, 182, 212, 0.2)',
      badge: 'linear-gradient(to right, rgba(34, 211, 238, 0.9), rgba(6, 182, 212, 0.9))',
      iconColor: 'rgba(34, 211, 238, 0.7)',
      tagBg: 'rgba(6, 182, 212, 0.1)',
      tagBorder: 'rgba(34, 211, 238, 0.25)'
    },
    {
      gradient: 'linear-gradient(to bottom right, rgba(251, 191, 36, 0.8), rgba(245, 158, 11, 0.8))',
      bgGradient: 'linear-gradient(to bottom right, rgba(245, 158, 11, 0.05), transparent)',
      border: 'rgba(245, 158, 11, 0.2)',
      badge: 'linear-gradient(to right, rgba(251, 191, 36, 0.9), rgba(245, 158, 11, 0.9))',
      iconColor: 'rgba(251, 191, 36, 0.7)',
      tagBg: 'rgba(245, 158, 11, 0.1)',
      tagBorder: 'rgba(251, 191, 36, 0.25)'
    },
    {
      gradient: 'linear-gradient(to bottom right, rgba(251, 113, 133, 0.8), rgba(244, 63, 94, 0.8))',
      bgGradient: 'linear-gradient(to bottom right, rgba(244, 63, 94, 0.05), transparent)',
      border: 'rgba(244, 63, 94, 0.2)',
      badge: 'linear-gradient(to right, rgba(251, 113, 133, 0.9), rgba(244, 63, 94, 0.9))',
      iconColor: 'rgba(251, 113, 133, 0.7)',
      tagBg: 'rgba(244, 63, 94, 0.1)',
      tagBorder: 'rgba(251, 113, 133, 0.25)'
    },
    {
      gradient: 'linear-gradient(to bottom right, rgba(167, 139, 250, 0.8), rgba(139, 92, 246, 0.8))',
      bgGradient: 'linear-gradient(to bottom right, rgba(139, 92, 246, 0.05), transparent)',
      border: 'rgba(139, 92, 246, 0.2)',
      badge: 'linear-gradient(to right, rgba(167, 139, 250, 0.9), rgba(139, 92, 246, 0.9))',
      iconColor: 'rgba(167, 139, 250, 0.7)',
      tagBg: 'rgba(139, 92, 246, 0.1)',
      tagBorder: 'rgba(167, 139, 250, 0.25)'
    }
  ]

  // Tailwind 값 → 픽셀 (sm breakpoint 기준)
  // max-w-2xl = 672px, px-7 = 28px, py-8 = 32px
  // text-xs = 12px, text-sm = 14px, text-base = 16px, text-lg = 18px, text-3xl = 30px
  // gap-2 = 8px, gap-4 = 16px, gap-1.5 = 6px, gap-0.5 = 2px
  // p-4 = 16px, px-3 = 12px, py-1.5 = 6px, py-1 = 4px, px-2.5 = 10px
  // mb-6 = 24px, mb-3 = 12px, mb-2 = 8px, mb-1.5 = 6px, mt-1 = 4px, pt-1 = 4px
  // rounded-xl = 12px, rounded-lg = 8px, rounded-full = 9999px
  // w-6 = 24px, w-5 = 20px, w-4 = 16px, w-3.5 = 14px, w-3 = 12px

  return (
    <div style={{
      backgroundColor: '#0D1117',
      borderRadius: '16px', // rounded-2xl
      width: '672px', // max-w-2xl
      maxWidth: '672px',
      minWidth: '672px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{
        paddingLeft: '28px', // px-7
        paddingRight: '28px',
        paddingTop: '32px', // py-8
        paddingBottom: '32px',
        width: '616px', // 672 - 28*2
        boxSizing: 'content-box'
      }}>
        {/* Header - mb-6 = 24px */}
        <div style={{ marginBottom: '24px' }}>
          {/* Calendar badge - gap-2=8px, px-3=12px, py-1.5=6px, mb-3=12px */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(19, 236, 91, 0.05)',
            borderRadius: '9999px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '6px',
            marginBottom: '12px',
            border: '1px solid rgba(19, 236, 91, 0.2)'
          }}>
            <span style={{ color: 'rgba(19, 236, 91, 0.8)', display: 'flex', alignItems: 'center' }}>
              <CalendarIcon />
            </span>
            {/* text-xs = 12px */}
            <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '500' }}>
              {getKoreanDateRange()}
            </span>
          </div>
          {/* title - text-3xl = 30px, mb-2 = 8px */}
          <h2 style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 8px 0',
            lineHeight: '1.2'
          }}>
            Weekly Workout Recap
          </h2>
          {/* subtitle - text-gray-400, default size = 14px */}
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>{data.subtitle}</p>
        </div>

        {/* Focus Stats Card - rounded-xl=12px, p-4=16px, mb-6=24px */}
        <div style={{
          background: 'linear-gradient(to bottom right, rgba(19, 236, 91, 0.05), transparent)',
          border: '1px solid rgba(19, 236, 91, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          width: '584px', // 616 - 16*2 padding
          boxSizing: 'content-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* gap-4 = 16px */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* w-6 h-6 = 24px */}
              <span style={{ color: 'rgba(19, 236, 91, 0.8)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <TargetIcon />
              </span>
              <div>
                {/* text-xs = 12px */}
                <div style={{ color: 'rgba(19, 236, 91, 0.8)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.025em' }}>
                  FOCUS
                </div>
                {/* text-base = 16px */}
                <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>
                  {data.focus}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {/* text-lg = 18px */}
              <div style={{ color: 'rgba(19, 236, 91, 0.9)', fontWeight: '600', fontSize: '18px' }}>
                주 {data.targetSessions}회 · {Math.round(data.totalMinutes / data.targetSessions)}분
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULE Section - mb-5 = 20px */}
        <div style={{ marginBottom: '20px' }}>
          {/* gap-2 = 8px, mb-3 = 12px */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            {/* w-4 h-4 = 16px */}
            <span style={{ color: '#ffffff', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <ListIcon />
            </span>
            <h3 style={{ color: '#ffffff', fontWeight: '600', letterSpacing: '0.05em', margin: 0, fontSize: '14px' }}>
              SCHEDULE
            </h3>
          </div>

          {/* Schedule Cards - space-y-3 = gap 12px */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '616px' }}>
            {data.schedule.map((item, index) => {
              const colors = colorSchemes[index % colorSchemes.length]

              return (
                <div
                  key={index}
                  style={{
                    background: colors.bgGradient,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px', // rounded-xl
                    padding: '16px', // p-4
                    boxSizing: 'border-box',
                    width: '100%'
                  }}
                >
                  {/* table 레이아웃 사용 - html2canvas 호환성 향상 */}
                  <div style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                    <div style={{ display: 'table-row' }}>
                      {/* Day Badge */}
                      <div style={{ display: 'table-cell', width: '76px', verticalAlign: 'top', paddingRight: '16px' }}>
                        <div style={{
                          background: colors.gradient,
                          borderRadius: '8px',
                          padding: '12px',
                          width: '60px',
                          textAlign: 'center',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          boxSizing: 'border-box'
                        }}>
                        {/* text-xs = 12px */}
                        <div style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontWeight: '500',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.025em'
                        }}>
                          {item.dayEn}
                        </div>
                        {/* text-sm = 14px, mt-1 = 4px */}
                        <div style={{
                          color: 'rgba(255, 255, 255, 0.95)',
                          fontWeight: '600',
                          fontSize: '14px',
                          marginTop: '4px'
                        }}>
                          {item.dayKo}
                        </div>
                        {/* text-xs = 12px, mt-1 = 4px, pt-1 = 4px */}
                        <div style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '500',
                          fontSize: '12px',
                          marginTop: '4px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                          paddingTop: '4px'
                        }}>
                          {item.time}
                          </div>
                        </div>
                      </div>

                      {/* Details - table-cell로 변경 */}
                      <div style={{ display: 'table-cell', verticalAlign: 'top' }}>
                      {/* Sport Type Badge - mb-1.5 = 6px */}
                      <div style={{ marginBottom: '6px' }}>
                        {/* px-3 = 12px, py-1 = 4px, text-xs = 12px */}
                        <span style={{
                          display: 'inline-block',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          background: colors.badge,
                          color: 'rgba(255, 255, 255, 0.95)',
                          fontSize: '12px',
                          borderRadius: '9999px',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          fontWeight: '500'
                        }}>
                          {item.type}
                        </span>
                      </div>

                      {/* Place Name - gap-0.5 = 2px, mb-2 = 8px */}
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {/* w-5 h-5 = 20px container */}
                        <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: colors.iconColor, display: 'flex', alignItems: 'center' }}>
                            <MapPinIcon />
                          </span>
                        </div>
                        {/* text-base = 16px */}
                        <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>
                          {item.place}
                        </span>
                      </div>

                      {/* Tags - gap-1.5 = 6px */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {/* px-2.5 = 10px, py-1 = 4px, text-xs = 12px, rounded-lg = 8px, gap-1.5 = 6px */}
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          paddingLeft: '10px',
                          paddingRight: '10px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          backgroundColor: colors.tagBg,
                          border: `1px solid ${colors.tagBorder}`,
                          borderRadius: '8px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <FootprintsIcon />
                          </span>
                          <span>{item.distanceWalk}</span>
                        </span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          paddingLeft: '10px',
                          paddingRight: '10px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          backgroundColor: colors.tagBg,
                          border: `1px solid ${colors.tagBorder}`,
                          borderRadius: '8px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <TagIcon />
                          </span>
                          <span>{item.tag}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoutineImageExport
