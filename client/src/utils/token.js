// 封装localStorage存取token

const key = 'token'

// 存
const setToken = (token) => {
    // 这里返回的是有没有存储成功的结果
    return window.localStorage.setItem(key, token)
}

// 取
const getToken = () => {
    // 这里返回取到的token值
    return window.localStorage.getItem(key)
}

// 删
const removeToken = () => {
    // 这里返回的是有没有移除成功的结果
    return window.localStorage.removeItem(key)
}

export {
    setToken,
    getToken,
    removeToken
}