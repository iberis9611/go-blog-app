import { Card, Avatar, Typography } from 'antd'
import { useEffect, useRef } from 'react'

const { Text } = Typography

function DisplayMessage({ messageList, chooseUser }) {
    const { friend_nickname } = chooseUser
    // Refs provide a way to access DOM nodes or React elements created in the render method.
    const bottomRef = useRef(null)
    // 发送消息或者接受消息后，滚动到最后
    // The ?. is called Elvis Operator (optional chaining) in JavaScript. It is basically used while accessing some property on an object to avoid null or undefined errors.
    useEffect(()=>{
        // Element.scrollIntoView() method scrolls an element into the visible area of the browser window.
        bottomRef.current?.scrollIntoView({behavior:'smooth'})
    }, [messageList])

    return (
        <Card className='message-list' id='scrollableDiv'>
            {/* Uncaught TypeError: list.map is not a function */}
            {/* Reason: after sending the message, the messageList becomes a single message Object */}
            {messageList.map( msg => (
                <Card className='message-row' key={msg.id}>
                    <Avatar className={msg.author!==friend_nickname ?'sent-avatar':'received-avatar'} src={msg.avatar} />
                    <Text className={msg.author!==friend_nickname?'sent-message':'received-message'}>{msg.content}</Text>
                </Card>
            ))}
            <div ref={bottomRef} />
        </Card>
    )
}

export default DisplayMessage