import moment from 'moment'
import { Card, Avatar, Space, Button, Typography } from 'antd'
import { http } from '@/utils'
import { toJS } from 'mobx'

const { Meta } = Card
const { Text } = Typography

const gridStyle = {
    width: '100%',
    borderRadius: '10px',
    background:'#ffffff'
}

const gridStyle2 = {
    width: '100%',
    borderRadius: '10px',
    background: '#e4e4e4',
}

function ChatList({ showSearchPanel, setShowSearchPanel, viewMessage, setViewMessage, chatList, userUuid, setMessageList, setChooseUser, getChooseUser, getSonMsg, getMessageList }) {
    
    const clickUser = (chat) => {
        // 修改被选中的聊天框样式
        setViewMessage(chat.to_uuid)
        setChooseUser({
            message_type: 1, // dm
            uuid: userUuid,
            friend_nickname: chat.chat_nickname,
            avatar: chat.chat_avatar,
        })
        // res is a Proxy Object
        const res = getChooseUser()
        // 引入TOJS函数，把数组强行转化为JS数组
        const user = toJS(res)
        fetchMessages(user)
    }

    const fetchMessages = async({message_type, uuid, friend_nickname}) => {
        let comments = []
        // Get request should have to body 
        const res = await http.get(`/messageList?message_type=${message_type}&uuid=${uuid}&friend_nickname=${friend_nickname}`)
        let data = res.data
        if (data === null) {
            data = []
        }
        for (var i = 0; i < data.length; i++) {
            let content = data[i].content
            let comment = {
                id: i+1,
                author: data[i].from_nickname,
                avatar: 'http://localhost:8000/file/' + data[i].avatar,
                content: content,
                datetime: moment(data[i].create_at).fromNow(),
            }
            comments.push(comment)
        }
        // I’ve updated the state, but logging gives me the old value because calling the set function does not change state in the running code.
        // This is because states behaves like a snapshot. Updating state requests another render with the new state value, but does not affect the 
        // count JavaScript variable in your already-running event handler.
        // If you need to use the next state, you can save it in a variable before passing it to the set function
        // Here, I made a getSonMsg in its Parent component to receive the value of message history.
        const historyMsg = comments
        getSonMsg(historyMsg)
        setMessageList(comments)
        getMessageList()
    }

    return (
        <Card className='messagePanel' style={showSearchPanel ? {display:'none'} : {}}>
            <Card className='buttonBar'>
                <Space className='buttonList'>
                    <Button type='text' size='small' className='readAll'>全部已读</Button>
                    <Button type='text' size='small' className='DM' onClick={()=>setShowSearchPanel(true)}>发私信</Button>  
                </Space>
            </Card>
            <Card className='messageList'>
            {chatList.map( chat => 
            // 为了提高diff算法的可复用性，需要在重复的元素上添加key属性，一般用id作为key的值。注意：不会出现在最终渲染结果中，只在虚拟dom中生效。
                <Card.Grid
                    key={chat.id}
                    className='aMessage'
                    onClick={()=>clickUser(chat)}
                    style={viewMessage === chat.to_uuid ? gridStyle2 : gridStyle}
                >
                    <Text type='secondary' style={{float:'right'}}>{moment(chat.update_at).fromNow()}</Text>
                    <Meta
                        avatar={<Avatar src={'http://localhost:8000/file/'+chat.chat_avatar} />}
                        title={chat.chat_nickname}
                        description={chat.message !== "" ? chat.message : <br />}
                    />
                </Card.Grid>
            )}
            </Card>
            
        </Card>
    )
}

export default ChatList