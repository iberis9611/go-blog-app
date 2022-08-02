// login module
// 5 调用makeAutoObservable方法
import { getToken, http, removeToken, setToken } from '@/utils'
import { makeAutoObservable, runInAction } from 'mobx'

class LoginStore {
    // 1 定义数据token 默认字符串
    token = getToken() || ''

    // 2 constructor调用方法
    constructor() {
        // 6 响应式
        makeAutoObservable(this)
    }
    
    // 3 定义操作token的方法setToken，解构username, password(getToken的返回值是Promise对象)
    getToken = async({username, password}) => {
            // 7 调用登录接口
            const res = await http.post('http://localhost:8000/user/login', {
                username,
                password
            })
            runInAction(() => {
                // 8 拿到数据res后，将其存入token中
                this.token = res.data.token
            })
            // 9 存入localStorage
            setToken(this.token)
    }
    logout = () => {
        runInAction(() => {
            this.token = ''
        })
        removeToken()
    }
}

// 4 导出
export default LoginStore