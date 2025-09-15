import './App.css';
import { Routes, Route, Link } from 'react-router-dom'; // 라우터 관련 컴포넌트 임포트
import History from './History.jsx';
import Portfolio from './Portfolio.jsx';
import Introduction from './Introduction.jsx';
import Dday from './Dday.jsx';

function App() {
  return (
    <div className="app-container">
      <header>
        <Dday />
      </header>
      <nav>
        <Link to="/history">이력</Link> | {" "}
        <Link to="/portfolio">포트폴리오</Link> | {" "}
        <Link to="/introduction">자기소개</Link>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/history" element={<History />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/introduction" element={<Introduction />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
