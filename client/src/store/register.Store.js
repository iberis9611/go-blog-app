import { makeAutoObservable, runInAction } from 'mobx'
import { http, setToken } from '@/utils'

class RegisterStore {
    token = ''

    constructor() {
        makeAutoObservable(this)
    }

    // 注册
    register = async ({token,username,password,nickname,create_at}) => {
        const res = await http.post('/user/register', {
            token,username,password,nickname,create_at
        })

        runInAction(() => {
            this.token = res.data.token
        })

        setToken(this.token) // 将token存入内存
    }
}

export default RegisterStore