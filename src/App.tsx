import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import Header from './components/common/Header'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark">
        <Header />
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
