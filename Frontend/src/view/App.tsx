import { useEffect, useState } from 'react'
import '../style/App.css'
import { asyncGet, asyncDelete, asyncPost, asyncPut, asyncGetOne } from '../utils/fetch'
import { api } from '../enum/api'
import pic1 from '../images/Group 25.png'

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  category: string;
  rating: string;
}

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState<'intro' | 'home' | 'search' | 'add'>('intro');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);

  const [formData, setFormData] = useState({
    rid: '',    // 新增這行
    name: '',
    location: '',
    category: '',
    rating: ''
  });

  const [searchName, setSearchName] = useState('');
  const [updateName, setUpdateName] = useState('');

  const areas = [
    '北投區', '士林區', '大同區', '中山區', '松山區', '內湖區',
    '萬華區', '中正區', '大安區', '信義區', '南港區', '文山區'
  ];

  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1.includes(s2) || s2.includes(s1)) {
      return 1;
    }
    let common = 0;
    for (let char of s1) {
      if (s2.includes(char)) {
        common++;
      }
    }
    return common / Math.max(s1.length, s2.length);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      const filtered = restaurants.filter(r => r.location.includes(selectedArea));
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [selectedArea, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const response = await asyncGet(api.findAll);
      if (response.code === 200 && response.body) {
        setRestaurants(response.body);
        setFilteredRestaurants(response.body);
      }
    } catch (error) {
      console.error('獲取餐廳列表失敗:', error);
    }
  };

  const handleAddRestaurant = async () => {
    if (!formData.rid || !formData.name || !formData.location || !formData.category || !formData.rating) {
      alert('請填寫所有欄位');
      return;
    }
  
    try {
      const response = await asyncPost(api.insertOne, formData);
      if (response.code === 200) {
        alert('新增成功');
        fetchRestaurants();
        setFormData({ rid: '', name: '', location: '', category: '', rating: '' });  // 重設表單時也清空rid
      } else if (response.code === 400) {
        alert('餐廳名稱已存在');
      }
    } catch (error) {
      alert('新增失敗');
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      alert('請輸入餐廳名稱');
      return;
    }

    try {
      const response = await asyncGet(api.findAll);
      if (response.code === 200 && response.body) {
        const results = response.body
          .map((restaurant: { name: string }) => ({
            ...restaurant,
            similarity: calculateSimilarity(restaurant.name, searchName)
          }))
          .filter((r: { similarity: number }) => r.similarity > 0.3)
          .sort((a: { similarity: number }, b: { similarity: number }) => b.similarity - a.similarity)
          .slice(0, 5);

        setSearchResults(results);

        if (results.length === 0) {
          alert('找不到相關餐廳');
        }
      }
    } catch (error) {
      alert('搜尋失敗');
      console.error(error);
    }
  };

  const handleUpdate = async (currentName: string) => {
    if (!updateName) {
      alert('請輸入新名稱');
      return;
    }

    try {
      const response = await asyncPut(`${api.update}?oldName=${currentName}&newName=${updateName}`);
      if (response.code === 200) {
        alert('更新成功');
        fetchRestaurants();
        setUpdateName('');
        handleSearch();
      } else if (response.code === 400) {
        alert('新名稱已存在');
      }
    } catch (error) {
      alert('更新失敗');
      console.error(error);
    }
  };

  const handleDelete = async (name: string) => {
    if (window.confirm('確定要刪除此餐廳嗎？')) {
      try {
        const response = await asyncDelete(`${api.delete}?name=${name}`);
        if (response.code === 200) {
          alert('刪除成功');
          fetchRestaurants();
          setSearchResults(prev => prev.filter(r => r.name !== name));
        }
      } catch (error) {
        alert('刪除失敗');
        console.error(error);
      }
    }
  };

  return (
    <div className="app-container">
      <div className="container">
        <header className="header">
          <div className="logo">
            <img src="../images/Group 25.png" alt="Zianba No1" />
            <h1>餐廳管理系統</h1>
          </div>
        </header>

        <div className="content-wrapper">
          <nav className="sidebar">
            <button
              className={activeTab === 'intro' ? 'active' : ''}
              onClick={() => setActiveTab('intro')}
            >
              首頁
            </button>
            <button
              className={activeTab === 'home' ? 'active' : ''}
              onClick={() => setActiveTab('home')}
            >
              餐廳列表
            </button>
            <button
              className={activeTab === 'search' ? 'active' : ''}
              onClick={() => setActiveTab('search')}
            >
              搜尋餐廳
            </button>
            <button
              className={activeTab === 'add' ? 'active' : ''}
              onClick={() => setActiveTab('add')}
            >
              新增餐廳
            </button>
          </nav>

          <main className="main-content">
            {activeTab === 'intro' && (
              <div className="intro-section">
                <div className="home-image">
                  <img src={pic1} alt="Zianba No1" />
                </div>
                <h2>INTRODUCTION</h2>
                <p>米其林指南 - 您的專業餐廳管理系統</p>
              </div>
            )}

            {activeTab === 'home' && (
              <div className="home-section">
                <div className="area-filters">
                  <button
                    className={selectedArea === '' ? 'selected' : ''}
                    onClick={() => setSelectedArea('')}
                  >
                    全部地區
                  </button>
                  {areas.map(area => (
                    <button
                      key={area}
                      className={selectedArea === area ? 'selected' : ''}
                      onClick={() => setSelectedArea(area)}
                    >
                      {area}
                    </button>
                  ))}
                </div>

                <div className="restaurant-list">
                  {filteredRestaurants.map(restaurant => (
                    <div key={restaurant._id} className="restaurant-card">
                      <h3>{restaurant.name}</h3>
                      <p>地址: {restaurant.location}</p>
                      <p>類別: {restaurant.category}</p>
                      <p>評分: {restaurant.rating}</p>
                      <div className="card-actions">
                        <button className="delete-btn" onClick={() => handleDelete(restaurant.name)}>
                          刪除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="search-section">
                <div className="search-form">
                  <input
                    type="text"
                    placeholder="請輸入餐廳名稱關鍵字"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <button onClick={handleSearch}>搜尋</button>
                </div>

                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map(restaurant => (
                      <div key={restaurant._id} className="restaurant-card">
                        <h3>{restaurant.name}</h3>
                        <p>地址: {restaurant.location}</p>
                        <p>類別: {restaurant.category}</p>
                        <p>評分: {restaurant.rating}</p>
                        <div className="update-form">
                          <input
                            type="text"
                            placeholder="新的餐廳名稱"
                            value={updateName}
                            onChange={(e) => setUpdateName(e.target.value)}
                          />
                          <button onClick={() => handleUpdate(restaurant.name)}>
                            更新名稱
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'add' && (
              <div className="add-form">
                <h2>新增餐廳</h2>
                <input
                  type="text"
                  placeholder="餐廳編號"
                  value={formData.rid}
                  onChange={e => setFormData({ ...formData, rid: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="餐廳名稱"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="地址"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="類別"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="評分"
                  value={formData.rating}
                  onChange={e => setFormData({ ...formData, rating: e.target.value })}
                />
                <button onClick={handleAddRestaurant}>新增</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;