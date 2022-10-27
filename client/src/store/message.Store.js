import { http } from '@/utils'
import { makeAutoObservable, runInAction } from 'mobx'

class MessageStore {
    chatList = []
    messageList = []
    chooseUser = {
        message_type: 1,        // 消息类型，1.单聊 2.群聊
        uuid: '',     // 接收方uuid
        friend_nickname: '', // 接收方nickname
        avatar: '',   // 接收方的头像
    }

    constructor() {
        makeAutoObservable(this)
    }
    
    // 获取聊天列表
    getChatList = async() => {
        const res = await http.get('/chats')
        runInAction(() => {
            this.chatList = res.data
        })
    }

    // 新增聊天（如果不存在的话）
    addChat = async({user_uuid, to_uuid, chat_nickname, chat_avatar, message_type}) => {
        await http.post('/chat/add',{
            user_uuid,
            to_uuid,
            chat_nickname,
            chat_avatar,
            message_type,
        })
    }

    setChooseUser = (value) => {
        this.chooseUser = value
    }

    getChooseUser = () => {
        return this.chooseUser
    }
    
    setMessageList = (value) => {
        this.messageList = value
    }

    getMessageList = () => {
        return this.messageList
    }

    // // 获取消息记录
    // getMessageList = async({message_type, uuid, friend_nickname}) => {
    //     const res = await http.get('/messageList',{
    //         message_type,
    //         uuid,
    //         friend_nickname,
    //     })
    //     runInAction(() => {
    //         this.messageList = res.data
    //     })
    // }
}

export default MessageStore