import EditorPanel from "./Components/EditorPanel"
import { Card } from 'antd'
import DisplayMessage from "./Components/DisplayMessage"
import moment from 'moment'

function MessagePanel({ sendMessage, messageList, setMessageList, chooseUser, userInfo  }) {

    // append the message sent to current chat list
    const appendMessage = (content) => {
        const { nickname, avatar } = userInfo
        setMessageList([
            ...messageList,
            {
                id: messageList.length+1,
                author: nickname,
                avatar: 'http://localhost:8000/file/' + avatar,
                content: content,
                datetime: moment().fromNow(),
            }
        ])
    }

    return (
        <Card className='messages' >
            {/* 内容展示框 */}
            <DisplayMessage  
                messageList={messageList}
                chooseUser={chooseUser}
            />
            {/* 消息输入框 */}
            <EditorPanel 
                sendMessage={sendMessage} 
                appendMessage={appendMessage} 
            />
        </Card>
    )
}

export default MessagePanel