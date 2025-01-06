import pic1 from '../images/pic.png';

interface HeaderProps {
  currentPage: 'intro' | 'home' | 'search' | 'add';
  setCurrentPage: (page: 'intro' | 'home' | 'search' | 'add') => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Header = ({ currentPage, setCurrentPage, isMenuOpen, setIsMenuOpen }: HeaderProps) => {
  // 新增關閉選單函數
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMenuOpen && e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  // 新增點擊按鈕時關閉選單
  const handleNavClick = (page: 'intro' | 'home' | 'search' | 'add') => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <button 
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className="logo">
        <img src={pic1} alt="Zianba No1" />
        <h1>餐廳管理系統</h1>
      </div>
      {/* 新增點擊事件處理 */}
      <nav 
        className={`nav-menu ${isMenuOpen ? 'active' : ''}`}
        onClick={handleClickOutside}
      >
        <button
          className={currentPage === 'intro' ? 'active' : ''}
          onClick={() => handleNavClick('intro')}
        >
          首頁
        </button>
        <button
          className={currentPage === 'home' ? 'active' : ''}
          onClick={() => handleNavClick('home')}
        >
          餐廳列表
        </button>
        <button
          className={currentPage === 'search' ? 'active' : ''}
          onClick={() => handleNavClick('search')}
        >
          搜尋餐廳
        </button>
        <button
          className={currentPage === 'add' ? 'active' : ''}
          onClick={() => handleNavClick('add')}
        >
          新增餐廳
        </button>
      </nav>
    </header>
  );
};

export default Header;