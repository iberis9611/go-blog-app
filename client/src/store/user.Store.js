import { makeAutoObservable, runInAction } from 'mobx'
import { http } from '@/utils'

class UserStore {
    userInfo = {}
    nameCard = {}
    avatarSrc = 'http://localhost:8000/file/'

    constructor() {
        makeAutoObservable(this)
    }

    // 获取用户信息
    getUserInfo = async () => {
        // 调用接口获取数据，获取用户信息
        const res = await http.get('user/profile')
        
        runInAction(() => {
            this.userInfo = res.data
        })
    }

    // 根据aid 获取文章作者名片
    getUserNameCard = async ({aid}) => {
        const res = await http.get(`/user/namecard?aid=${aid}`)
        
        runInAction(() => {
            this.nameCard = res.data
            console.log(res.data)
        })
    }

    // 根据uuid 获取文章作者名片
    getUserNameCardByUuid = async ({uuid}) => {
        const res = await http.get(`/user/people/${uuid}`)
        
        runInAction(() => {
            this.nameCard = res.data
        })
    }

    // 关注作者
    followAuthor = async ({aid}) => {
        await http.post(`/user/clickFollow?aid=${aid}`)
    }

    // 修改用户信息
    modifyProfile = async ({birthday,email,gender,intro,phone,address,avatar}) => {
        await http.post('/user/modifyProfile',{
            birthday,email,gender,intro,phone,address,avatar
        })
    }
}

export default UserStore