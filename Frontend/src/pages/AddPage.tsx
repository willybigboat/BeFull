import { useState } from 'react';
import { asyncPost } from '../utils/fetch';
import { api } from '../enum/api';

const AddPage = () => {
  const [formData, setFormData] = useState({
    rid: '',
    name: '',
    location: '',
    category: '',
    rating: ''
  });

  const handleAddRestaurant = async () => {
    if (!formData.rid || !formData.name || !formData.location || !formData.category || !formData.rating) {
      alert('請填寫所有欄位');
      return;
    }

    const rating = parseFloat(formData.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert('評分必須介於1到5之間');
      return;
    }

    try {
      const response = await asyncPost(api.insertOne, formData);
      if (response.code === 200) {
        alert('新增成功');
        setFormData({ rid: '', name: '', location: '', category: '', rating: '' });
      } else if (response.code === 400) {
        alert('餐廳名稱已存在');
      }
    } catch (error) {
      alert('新增失敗');
      console.error(error);
    }
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 1 && parseFloat(value) <= 5)) {
      setFormData({ ...formData, rating: value });
    }
  };

  return (
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
        type="number"
        placeholder="評分 (1-5)"
        value={formData.rating}
        onChange={handleRatingChange}
        min="1"
        max="5"
        step="1"
      />
      <button onClick={handleAddRestaurant}>新增</button>
    </div>
  );
};

export default AddPage;