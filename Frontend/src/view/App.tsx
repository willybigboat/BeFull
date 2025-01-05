import { useEffect, useRef, useState } from 'react'
import '../style/App.css'
import { asyncGet, asyncDelete, asyncPost, asyncPut, asyncGetOne } from '../utils/fetch'
import { api } from '../enum/api'
import { restaurant } from '../interface/restaurant'
import { resp } from '../interface/resp'

function App() {
  const [restaurants, setRestaurants] = useState<Array<restaurant>>([])
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [cuisine, setCuisine] = useState("")
  const [rating, setRating] = useState("")
  const [findId, setFindId] = useState("")
  const [newName, setNewName] = useState("")
  const [searchId, setSearchId] = useState("")
  const [searchedRestaurant, setSearchedRestaurant] = useState<restaurant | null>(null)
  const [activeTab, setActiveTab] = useState<'列表' | '搜尋' | '刪除' | '新增' | '更新'>('列表')

  const apiEndpoint = `${api.delete}?id=${id}`

  async function handleDelete() {
    try {
      const response = await asyncDelete(apiEndpoint)
      if (response.code === 200) {
        alert("刪除成功")
        fetchRestaurants()
      } else if (response.code === 404) {
        alert("找不到餐廳")
      } else {
        alert("伺服器錯誤")
      }
    }
    catch (error) {
      alert(error)
    }
  }

  async function insert() {
    try {
      const response = await asyncPost(api.insertOne, {
        "name": name,
        "address": address,
        "cuisine": cuisine,
        "rating": rating
      })
      if (response.code === 200) {
        alert("新增成功")
        fetchRestaurants()
      } else {
        alert("伺服器錯誤")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  async function update() {
    const apiEndpoint = `${api.update}?id=${findId}&name=${newName}`
    try {
      const response = await asyncPut(apiEndpoint)
      if (response.code === 200) {
        alert("更新成功")
        fetchRestaurants()
      } else if (response.code === 404) {
        alert("找不到餐廳")
      } else {
        alert("伺服器錯誤")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  async function searchRestaurant() {
    try {
      const response = await asyncGetOne(`${api.findOne}?id=${searchId}`)
      if (response.code === 200 && response.body) {
        setSearchedRestaurant(response.body)
      } else {
        alert("找不到該餐廳")
        setSearchedRestaurant(null)
      }
    }
    catch (error) {
      console.log(error)
      alert("查詢錯誤")
    }
  }

  const cache = useRef<boolean>(false)

  const fetchRestaurants = () => {
    asyncGet(api.findAll).then((res: resp<Array<restaurant>>) => {
      if (res.code === 200) {
        setRestaurants(res.body)
      }
    });
  }

  useEffect(() => {
    if (!cache.current) {
      cache.current = true;
      fetchRestaurants()
    }
  }, [])

  const restaurantList = restaurants ? restaurants.map((restaurant: restaurant) => {
    return (
      <div className='restaurant' key={restaurant._id}>
        <p>ID: {restaurant._id}</p>
        <p>名稱: {restaurant.name}</p>
        <p>地址: {restaurant.location}</p>
        <p>料理類型: {restaurant.category}</p>
        <p>評分: {restaurant.rating}</p>
      </div>
    )
  }) : "載入中..."

  return (
    <div className="app-container">
      <h1>RestaurantHub</h1>
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === '列表' ? 'active' : ''}`} 
          onClick={() => setActiveTab('列表')}
        >
          餐廳列表
        </button>
        <button 
          className={`tab-btn ${activeTab === '搜尋' ? 'active' : ''}`} 
          onClick={() => setActiveTab('搜尋')}
        >
          搜尋餐廳
        </button>
        <button 
          className={`tab-btn ${activeTab === '刪除' ? 'active' : ''}`} 
          onClick={() => setActiveTab('刪除')}
        >
          刪除餐廳
        </button>
        <button 
          className={`tab-btn ${activeTab === '新增' ? 'active' : ''}`} 
          onClick={() => setActiveTab('新增')}
        >
          新增餐廳
        </button>
        <button 
          className={`tab-btn ${activeTab === '更新' ? 'active' : ''}`} 
          onClick={() => setActiveTab('更新')}
        >
          更新餐廳
        </button>
      </div>

      <div className="tab-content">
        {activeTab === '列表' && (
          <div className='block'>
            <div className="container">
              {restaurantList}
            </div>
          </div>
        )}

        {activeTab === '搜尋' && (
          <div className="input-section">
            <div className="input-wrapper">
              <label>以ID搜尋餐廳</label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="輸入餐廳ID"
              />
              <button onClick={searchRestaurant}>搜尋</button>
            </div>

            {searchedRestaurant && (
              <div className='block'>
                <div className="container">
                  <div className='restaurant'>
                    <p>ID: {searchedRestaurant._id}</p>
                    <p>名稱: {searchedRestaurant.name}</p>
                    <p>地址: {searchedRestaurant.location}</p>
                    <p>料理類型: {searchedRestaurant.category}</p>
                    <p>評分: {searchedRestaurant.rating}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === '刪除' && (
          <div className="input-section">
            <div className="input-wrapper">
              <label>以ID刪除餐廳</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="輸入餐廳ID"
              />
              <button onClick={handleDelete}>刪除</button>
            </div>
          </div>
        )}

        {activeTab === '新增' && (
          <div className="input-section">
            <div className="input-wrapper">
              <label>名稱</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="輸入餐廳名稱"
              />
            </div>
            <div className="input-wrapper">
              <label>地址</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="輸入地址"
              />
            </div>
            <div className="input-wrapper">
              <label>料理類型</label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="輸入料理類型"
              />
            </div>
            <div className="input-wrapper">
              <label>評分</label>
              <input
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="輸入評分"
              />
            </div>
            <div className="input-wrapper">
              <button onClick={insert}>新增</button>
            </div>
          </div>
        )}

        {activeTab === '更新' && (
          <div className="input-section">
            <div className="input-wrapper">
              <label>查找ID</label>
              <input
                type="text"
                value={findId}
                onChange={(e) => setFindId(e.target.value)}
                placeholder="輸入要更新的ID"
              />
            </div>
            <div className="input-wrapper">
              <label>新名稱</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="輸入新名稱"
              />
            </div>
            <div className="input-wrapper">
              <button onClick={update}>更新</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App