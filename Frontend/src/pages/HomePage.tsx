import { useEffect, useState } from 'react';
import { asyncGet, asyncDelete } from '../utils/fetch';
import { api } from '../enum/api';
import { restaurant } from '../interface/restaurant';
import { areas, areasNTP } from '../constants/areas';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState<restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<restaurant[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      const filtered = restaurants.filter(r => r.location.includes(selectedArea));
      // 保持排序
      const sortedFiltered = [...filtered].sort((a, b) => Number(a.rid) - Number(b.rid));
      setFilteredRestaurants(sortedFiltered);
    } else {
      // 全部顯示時也要排序
      const sortedAll = [...restaurants].sort((a, b) => Number(a.rid) - Number(b.rid));
      setFilteredRestaurants(sortedAll);
    }
  }, [selectedArea, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const response = await asyncGet(api.findAll);
      if (response.code === 200 && response.body) {
        // 獲取資料時先排序
        const sortedRestaurants = response.body.sort((a: { rid: any; }, b: { rid: any; }) => Number(a.rid) - Number(b.rid));
        setRestaurants(sortedRestaurants);
        setFilteredRestaurants(sortedRestaurants);
      }
    } catch (error) {
      console.error('獲取餐廳列表失敗:', error);
    }
  };

  const handleDelete = async (name: string) => {
    if (window.confirm('確定要刪除此餐廳嗎？')) {
      try {
        const response = await asyncDelete(`${api.delete}?name=${name}`);
        if (response.code === 200) {
          alert('刪除成功');
          fetchRestaurants();
        }
      } catch (error) {
        alert('刪除失敗');
        console.error(error);
      }
    }
  };

  return (
    <div className="home-section">
      <div className="area-filters">
        <div className='all-areas'>
          <button
            className={selectedArea === '' ? 'selected' : ''}
            onClick={() => setSelectedArea('')}
          >
            全部地區
          </button>
        </div>
        <div className='area-group'>
          <p>台北市</p>
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
        <div className='area-group'>
          <p>新北市</p>
          {areasNTP.map(area1 => (
            <button
              key={area1}
              className={selectedArea === area1 ? 'selected' : ''}
              onClick={() => setSelectedArea(area1)}
            >
              {area1}
            </button>          
          ))}
        </div>
      </div>

      <div className="restaurant-list">
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant._id} className="restaurant-card">
            <h3>#{restaurant.rid} {restaurant.name}</h3>
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
  );
};

export default HomePage;