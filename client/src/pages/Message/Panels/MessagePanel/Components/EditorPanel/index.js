import { Card, Space, Button, Input, Modal } from 'antd'
import { SmileOutlined, FileImageOutlined, FolderOpenOutlined, AudioOutlined, PhoneOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { TextArea } = Input

function EditorPanel({ sendMessage, appendMessage }) {
    // 消息内容
    const [messageInput, setMessageInput] = useState('')

    const emptyMessageAlert = () => {
        Modal.info({
            centered: true,
            content: '不能发送空白消息'
        })
    }

    const handleSubmit = () => {
        if (messageInput.trim()==='') {
            emptyMessageAlert()
        } else {
            const message = {
                content: messageInput,
                content_type: 1, // plain text message
                message_type: 1, // dm
            }
            sendMessage(message)
            appendMessage(messageInput)
        }
        // clear textarea
        setMessageInput('')
    }
    const clearTextArea = () => {
        setMessageInput('')
    }

    return (
        <Card className='editorPanel' hoverable>
            <TextArea 
                autoSize={{minRows:2, maxRows:10}} 
                value={messageInput}
                onChange={(e)=>setMessageInput(e.target.value)}
            />
            <Space className='editorOptions'>
                <Button type='text'>
                    <SmileOutlined />
                </Button>
                <Button type='text'>
                    <FileImageOutlined />
                </Button>
                <Button type='text'>
                    <FolderOpenOutlined />
                </Button>
                <Button type='text'>
                    <AudioOutlined />
                </Button>
                <Button type='text'>
                    <PhoneOutlined />
                </Button>
                <Button type='text'>
                    <VideoCameraOutlined />
                </Button>
            </Space>
            <Space className='submitOptions'>
                <Button type='text' disabled={!messageInput && true} onClick={clearTextArea}>取消</Button>
                <Button type='primary' disabled={!messageInput && true} onClick={handleSubmit}>发送</Button>
            </Space>                                
        </Card>
    )
}

export default EditorPanel