import {Avatar, Button, Input} from 'antd'
import {UserOutlined} from '@ant-design/icons'
const {TextArea} = Input

const CommentEditor = () => {
    return (
        <div 
            className="commentEditor" 
            style={{
                display:'flex',
                padding:'16px 0'
            }}
        >
            <div className="commentAvatar"><Avatar size="middle" icon={<UserOutlined />} /></div>
            <TextArea placeholder="写评论" autoSize style={{margin:"0 12px"}}/>
            <Button type="primary">发布</Button>
        </div>     
    )
}

export {
    CommentEditor
}