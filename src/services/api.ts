import axios from 'axios'

// 建立 Axios 實例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器：自動附加 JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 回應攔截器：處理 401 未授權錯誤
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token 過期或無效，清除本地資料並重導向至登入頁
      // 注意：這裡不直接操作 Router，避免循環依賴，建議在 Store 或 Component 中處理重導向
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // window.location.href = '/login'; // 可選：強制重導向
    }
    return Promise.reject(error)
  },
)

export default api
