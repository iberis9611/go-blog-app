// 封装axios
// 实例化 请求拦截器 相应拦截器

// 1. 导入axios的依赖
import axios from 'axios'
import { getToken } from './token'

// 2.获得一个http实例对象
const http = axios.create({
    baseURL: 'http://localhost:8000', // 根域
    timeout: 10000 // 超时时间
})

// 3.配置请求拦截器（这里将来会配置token注入）
// 在每个接口发送请求前，先拦截下来并注入token。此后，只要用接口发送请求，就自动拥有了token
http.interceptors.request.use((config) => {
    // 从本地获取token 
    const token = getToken()
    if (token) {
        // 如果token存在，config.headers是请求头,后面是由后端规定的请求头的格式
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// 4.配置相应拦截器
http.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return response.data
}, (error) => {
    // 超出2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    return Promise.reject(error)
})

// 5.导出http方法
export {http}