import { LikeOutlined, MessageOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons'
import { Avatar, Card, List, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { http } from '@/utils'
import './index.scss'

const IconText = ({ icon, text }) => (
<Space>
    {React.createElement(icon)}
    {text}
</Space>
)

function Home() {

    const {userStore} = useStore()

    // 文章列表管理
    const [articleList, setArticleList] = useState([])
    const loadArticleList = async () => {
        // http.get('/data')发送接口请求，用res接收数据
        const res = await http.get('/articles')
        // 调用setArticleList，将数据存入articleList中
        setArticleList(res.data)
        console.log(res.data)
    }
    useEffect(() => {
        loadArticleList() // 外面写里面调
    }, [])

    return (
        <div className='homeWrapper' style={{margin:'0 50px'}}>
            <List
            itemLayout="vertical"
            size="large"
            pagination={{
            onChange: (page) => {
                console.log(page);
            },
            pageSize: 10,
            }}
            style={{
                background:'#f0f2f5',
            }}
            dataSource={articleList}
            renderItem={(art) => (
                <Link to={'article/'+art.aid}>
                <Card.Grid style={{width:'100%', background:'antiquewhite', margin:'5px 0', padding:'0', cursor:'auto'}}>
                    <List.Item
                        key={art.id}
                        style={{
                            background:'white'
                        }}
                        actions={[
                            <IconText icon={EyeOutlined} text={art.view_count} key="list-vertical-view" />,
                            <IconText icon={LikeOutlined} text={art.like_count} key="list-vertical-like-o" />,
                            <IconText icon={StarOutlined} text={art.save_count} key="list-vertical-star-o" />,
                            <IconText icon={MessageOutlined} text={art.comment_count} key="list-vertical-message" />,
                        ]}
                        extra={
                        <img
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar size={45} src={userStore.avatarSrc+art.avatar} />}
                            title={art.title}
                            description={art.author}
                        />
                        {art.content}
                    </List.Item>
                </Card.Grid>
                </Link>
            )}
        />
        </div>
        
    )
}

export default Home