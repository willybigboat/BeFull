interface SidebarProps {
    currentPage: 'intro' | 'home' | 'search' | 'add';
    setCurrentPage: (page: 'intro' | 'home' | 'search' | 'add') => void;
  }
  
  const Sidebar = ({ currentPage, setCurrentPage }: SidebarProps) => {
    return (
      <nav className="sidebar">
        <button
          className={currentPage === 'intro' ? 'active' : ''}
          onClick={() => setCurrentPage('intro')}
        >
          首頁
        </button>
        <button
          className={currentPage === 'home' ? 'active' : ''}
          onClick={() => setCurrentPage('home')}
        >
          餐廳列表
        </button>
        <button
          className={currentPage === 'search' ? 'active' : ''}
          onClick={() => setCurrentPage('search')}
        >
          搜尋餐廳
        </button>
        <button
          className={currentPage === 'add' ? 'active' : ''}
          onClick={() => setCurrentPage('add')}
        >
          新增餐廳
        </button>
      </nav>
    );
  };
  export default Sidebar;