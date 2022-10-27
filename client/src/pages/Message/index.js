import { useStore } from '@/store'
import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import './index.scss'
import { getToken } from '@/utils'
import Sidebar from './Panels/Sidebar'
import MessagePanel from './Panels/MessagePanel'
import moment from 'moment'
/* eslint-disable react-hooks/exhaustive-deps */

const { Content, Sider } = Layout
const baseURL = 'ws://localhost:8000/ws'
var ws = null
let messages = []

function Message() {

    const mytoken = getToken()
    const { messageStore, userStore } = useStore()
    // 正在查看的消息 to_uuid
    const [viewMessage, setViewMessage] = useState('')

    // Since React's setState is asynchronous (both classes and hooks), it's not practical
    // to use setState to get the nickname from a http request in the first rendering.
    useEffect(()=>{
        messageStore.getChatList()
        userStore.getUserInfo()
        // 读取需要高光显示的chatname
        const friend_uuid = sessionStorage.getItem("friend_uuid")
        setViewMessage(friend_uuid)
        // 删除数据
        sessionStorage.removeItem("friend_uuid")
        enterChat()
    },[]) 

    const { chatList, chooseUser, setChooseUser, getChooseUser, messageList, setMessageList, getMessageList } = messageStore

    // Get the messageList from a son component
    const getSonMsg = (sonMsg) => {
        messages = sonMsg
    }

    // Open websocket connection upon entering the chat
    const enterChat = () => {
        ws = new WebSocket(baseURL + `?nickname=${mytoken}`)

        ws.onopen = (event) => {
            console.log('sucessfully connected', event)
        }

        ws.onmessage = (msg) => {
            const reader = new FileReader()
            //读取文件，并设置编码格式为utf-8
            reader.readAsText(msg.data,'utf-8') 
            // onload事件是读取完成的时候触发
            reader.onload = (() => {
                //reader.result返回文件的内容，只在读取操作完成后有效
                const res = JSON.parse(reader.result)    
                const {friend_nickname, avatar} = getChooseUser()
                // Notice: onmessage will reset data of messageStore, so we cannot use setMessageList directly
                // because it only returns the updated state after the lifecycle is complete.
                const newMessage = {
                    id: messages.length+1,
                    author: friend_nickname,
                    avatar: 'http://localhost:8000/file/' + avatar,
                    content: res.content,
                    datetime: moment().fromNow(),
                }
                setMessageList([...messages,newMessage])
                messages.push(newMessage)
            })
        }

        ws.onclose = (event) => {
            console.log('socket closed connection', event)
        }

        ws.onerror = (error) => {
            console.log('socket error:', error)
        }
    }

    // 发送消息
    const sendMessage = (messageData) => {
        const data = {
            ...messageData,
            from: mytoken,
            to: viewMessage,
        }
        // Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
        const message = JSON.stringify(data)
        ws.send(message)
    }

    return (
        <Layout className='chatroomWrapper'>
            {/* 侧边栏 */}
            <Sider width='20%' className='chatSider'>
                <Sidebar 
                    viewMessage={viewMessage} 
                    setViewMessage={setViewMessage}
                    chatList={chatList}
                    userUuid={mytoken} 
                    setChooseUser={setChooseUser}
                    getChooseUser={getChooseUser}
                    setMessageList={setMessageList}
                    messageList={messageList}
                    getSonMsg={getSonMsg}
                    getMessageList={getMessageList}
                />
            </Sider>
            {/* 聊天面板 */}
            <Layout>
                <Content className='chatPanel'>
                    {
                        viewMessage !== null
                        ?
                        <MessagePanel 
                            sendMessage={sendMessage}
                            messageList={messageList}
                            setMessageList={setMessageList}
                            chooseUser={chooseUser}
                            userInfo={userStore.userInfo}
                        />
                        :
                        <h1>No Chat Selected</h1>
                    }
                    
                </Content>
            </Layout>
        </Layout>
    )
}

export default observer(Message)