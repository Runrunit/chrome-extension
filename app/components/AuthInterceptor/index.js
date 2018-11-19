/* global localStorage */
import axios from 'axios'

const AuthInterceptor = axios.create()
AuthInterceptor.interceptors.request.use((config) => {
  config.headers['App-Key'] = localStorage.getItem('appkey')
  config.headers['User-Token'] = localStorage.getItem('usertoken')
  config.headers['X-Platform'] = 'ChromeExtension'

  return config
})

export default AuthInterceptor
