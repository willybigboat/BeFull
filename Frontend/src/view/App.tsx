import { useState } from 'react';
import '../style/App.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AddPage from '../pages/AddPage';
import IntroPage from '../pages/introPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'intro' | 'home' | 'search' | 'add'>('intro');

  return (
    <div className="app-container">
      <div className="container">
        <Header />
        <div className="content-wrapper">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="main-content">
            {currentPage === 'intro' && <IntroPage />}
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'search' && <SearchPage />}
            {currentPage === 'add' && <AddPage />}
          </main>
        </div>
      </div>
    </div>
  );
}