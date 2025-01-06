import { useState } from 'react';
import { asyncGet, asyncPut } from '../utils/fetch';
import { api } from '../enum/api';
import { restaurant } from '../interface/restaurant';

const SearchPage = () => {
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<restaurant[]>([]);
  const [updateName, setUpdateName] = useState('');

  const handleSearch = async () => {
    if (!searchName.trim()) {
      alert('請輸入餐廳名稱');
      return;
    }

    try {
      const response = await asyncGet(api.findAll);
      if (response.code === 200 && response.body) {
        const results = response.body
          .filter((restaurant: restaurant) => 
            restaurant.name.toLowerCase().includes(searchName.toLowerCase())
          );

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
        handleSearch();
        setUpdateName('');
      } else if (response.code === 400) {
        alert('新名稱已存在');
      }
    } catch (error) {
      alert('更新失敗');
      console.error(error);
    }
  };

  return (
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
  );
};

export default SearchPage;