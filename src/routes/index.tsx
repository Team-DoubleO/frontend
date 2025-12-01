import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import SurveyStep1 from '../pages/survey/SurveyStep1'
import SurveyStep2 from '../pages/survey/SurveyStep2'
import SurveyStep3 from '../pages/survey/SurveyStep3'
import SurveyStep4 from '../pages/survey/SurveyStep4'
import ProgramListPage from '../pages/ProgramListPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/survey/step1" element={<SurveyStep1 />} />
      <Route path="/survey/step2" element={<SurveyStep2 />} />
      <Route path="/survey/step3" element={<SurveyStep3 />} />
      <Route path="/survey/step4" element={<SurveyStep4 />} />
      <Route path="/programs" element={<ProgramListPage />} />
    </Routes>
  )
}

export default AppRoutes
