import { useEffect, useState } from 'react';
import { asyncGet, asyncDelete } from '../utils/fetch';
import { api } from '../enum/api';
import { restaurant } from '../interface/restaurant';
import { areas } from '../constants/areas';

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
  );
};

export default HomePage;