import { useEffect, useState } from 'react';
import '../style/App.css';
import Header from '../components/Header';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AddPage from '../pages/AddPage';
import IntroPage from '../pages/introPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'intro' | 'home' | 'search' | 'add'>(() => {
    const savedPage = localStorage.getItem('currentPage');
    return (savedPage as 'intro' | 'home' | 'search' | 'add') || 'intro';
  });

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);
  return (
    <div className="app-container">
      <div className="container">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <div className="content-wrapper">
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
};

export default App;