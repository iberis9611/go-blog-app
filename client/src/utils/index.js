// 1.先将所有工具函数导出的模块在这里导入
import { http } from "./http"
import { setToken, getToken, removeToken } from "./token"

// 2.再统一导出
export {
    http,
    setToken,
    getToken,
    removeToken
}