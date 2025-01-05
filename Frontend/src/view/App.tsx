import { useEffect, useRef, useState } from 'react'
import '../style/App.css'
import { asyncGet, asyncDelete, asyncPost, asyncPut, asyncGetOne } from '../utils/fetch'
import { api } from '../enum/api'
import { Student } from '../interface/Student'
import { resp } from '../interface/resp'

function App() {
  const [students, setStudents] = useState<Array<Student>>([])
  const [id, setid] = useState("")
  const [account, setaccount] = useState("")
  const [name, setname] = useState("")
  const [department, setdepartment] = useState("")
  const [grade, setgrade] = useState("")
  const [Class, setclass] = useState("")
  const [Email, setemail] = useState("")
  const [findid, setfindid] = useState("")
  const [newName, setnewName] = useState("")
  const [searchId, setSearchId] = useState("")
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState<'列表' | '搜尋' | '刪除' | '新增' | '更新'>('列表')

  const apiEndpoint = `${api.delete}?id=${id}`

  async function handledelete() {
    try {
      const response = await asyncDelete(apiEndpoint)
      if (response.code == 200) {
        alert("刪除成功")
        fetchStudents()
      } else if (response.code == 404) {
        alert("找不到使用者")
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
        "userName": account,
        "name": name,
        "department": department,
        "grade": grade,
        "class": Class,
        "email": Email
      })
      if (response.code == 200) {
        alert("新增成功")
        fetchStudents()
      } else if (response.code == 403) {
        alert("重複的使用者帳號")
      } else {
        alert("伺服器錯誤")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  async function update() {
    const apiEndpoint = `${api.update}?id=${findid}&name=${newName}`
    try {
      const response = await asyncPut(apiEndpoint)
      if (response.code == 200) {
        alert("更新成功")
        fetchStudents()
      } else if (response.code == 404) {
        alert("找不到使用者")
      } else {
        alert("伺服器錯誤")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  async function searchStudent() {
    try {
      const response = await asyncGetOne(`${api.findOne}?id=${searchId}`)
      if (response.code == 200 && response.body) {
        setSearchedStudent(response.body)
      } else {
        alert("找不到該學生")
        setSearchedStudent(null)
      }
    }
    catch (error) {
      console.log(error)
      alert("查詢錯誤")
    }
  }

  const cache = useRef<boolean>(false)

  const fetchStudents = () => {
    asyncGet(api.findAll).then((res: resp<Array<Student>>) => {
      if (res.code == 200) {
        setStudents(res.body)
      }
    });
  }

  useEffect(() => {
    if (!cache.current) {
      cache.current = true;
      fetchStudents()
    }
  }, [])

  const studentList = students ? students.map((student: Student) => {
    return (
      <div className='student' key={student._id}>
        <p>ID: {student._id}</p>
        <p>帳號: {student.userName}</p>
        <p>座號: {student.sid}</p>
        <p>姓名: {student.name}</p>
        <p>院系: {student.department}</p>
        <p>年级: {student.grade}</p>
        <p>班级: {student.class}</p>
        <p>Email: {student.email}</p>
        <p>缺席次數: {student.absences ? student.absences : 0}</p>
      </div>
    )
  }) : "載入中..."

  return (
    <div className="app-container">
      <h1>StudentHub</h1>
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === '列表' ? 'active' : ''}`} 
          onClick={() => setActiveTab('列表')}
        >
          學生列表
        </button>
        <button 
          className={`tab-btn ${activeTab === '搜尋' ? 'active' : ''}`} 
          onClick={() => setActiveTab('搜尋')}
        >
          搜尋學生
        </button>
        <button 
          className={`tab-btn ${activeTab === '刪除' ? 'active' : ''}`} 
          onClick={() => setActiveTab('刪除')}
        >
          刪除學生
        </button>
        <button 
          className={`tab-btn ${activeTab === '新增' ? 'active' : ''}`} 
          onClick={() => setActiveTab('新增')}
        >
          新增學生
        </button>
        <button 
          className={`tab-btn ${activeTab === '更新' ? 'active' : ''}`} 
          onClick={() => setActiveTab('更新')}
        >
          更新學生
        </button>
      </div>

      <div className="tab-content">
        {activeTab === '列表' && (
          <div className='block'>
            <div className="container">
              {studentList}
            </div>
          </div>
        )}

        {activeTab === '搜尋' && (
          <div className="input-section">
            <div className="input-wrapper">
              <label>以ID搜尋學生</label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="輸入學生ID"
              />
              <button onClick={searchStudent}>搜尋</button>
            </div>

            {searchedStudent && (
              <div className='block'>
                <div className="container">
                  <div className='student'>
                    <p>ID: {searchedStudent._id}</p>
                    <p>帳號: {searchedStudent.userName}</p>
                    <p>座號: {searchedStudent.sid}</p>
                    <p>姓名: {searchedStudent.name}</p>
                    <p>院系: {searchedStudent.department}</p>
                    <p>年级: {searchedStudent.grade}</p>
                    <p>班级: {searchedStudent.class}</p>
                    <p>Email: {searchedStudent.email}</p>
                    <p>缺席次數: {searchedStudent.absences ? searchedStudent.absences : 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === '刪除' && (
          <div className="input-section">
            <div className="input-wrapper">
              <label>以ID刪除學生</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setid(e.target.value)}
                placeholder="輸入學生ID"
              />
              <button onClick={handledelete}>刪除</button>
            </div>
          </div>
        )}

        {activeTab === '新增' && (
          <div className="input-section">
            
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <label>帳號</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setaccount(e.target.value)}
                placeholder="輸入帳號"
              />
            </div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <label>姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="輸入姓名"
              />
            </div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <label>院系</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setdepartment(e.target.value)}
                placeholder="輸入院系"
              />
            </div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper"></div> 
            <div className="input-wrapper">
              <label>年级</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setgrade(e.target.value)}
                placeholder="輸入年級"
              />
            </div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <label>班级</label>
              <input
                type="text"
                value={Class}
                onChange={(e) => setclass(e.target.value)}
                placeholder="輸入班级"
              />
            </div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <label>Email</label>
              <input
                type="text"
                value={Email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="輸入Email"
              />
            </div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <button onClick={insert}>新增</button>
            </div>
          </div>
        )}

        {activeTab === '更新' && (
          <div className="input-section">
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <label>查找ID</label>
              <input
                type="text"
                value={findid}
                onChange={(e) => setfindid(e.target.value)}
                placeholder="輸入要更新的ID"
              />
            </div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper"></div>
            <div className="input-wrapper">
              <label>新姓名</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setnewName(e.target.value)}
                placeholder="輸入新姓名"
              />
            </div>
            <div className="input-wrapper"></div>
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