import { LikeOutlined, MessageOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons'
import { Avatar, Card, List, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { http } from '@/utils'
import './index.scss'
/* eslint-disable react-hooks/exhaustive-deps */

const IconText = ({ icon, text }) => (
<Space>
    {React.createElement(icon)}
    {text}
</Space>
)

function Home() {

    const {userStore} = useStore()
    const {avatarSrc} = userStore
    // 文章列表管理
    const [articleData, setArticleData] = useState({
        list: [],
        count: 0,
    }) 
    const [params, setParams] = useState({
        page: 1,
        per_page: 5,
    })
    const loadArticleList = async () => {
        // http.get('/data')发送接口请求，用res接收数据
        const res = await http.get(`/articleList?search_type=all&page=${params.page}&per_page=${params.per_page}`)
        // 调用setArticleList，将数据存入articleList中
        const { result, total_count } = res.data
        setArticleData({
            list: result,
            count: total_count,
        })
    }
    useEffect(() => {
        loadArticleList() // 外面写里面调
    }, [params])

    return (
        <div className='homeWrapper' style={{margin:'0 50px'}}>
            <List
            itemLayout="vertical"
            size="large"
            pagination={{
                pageSize: params.per_page,
                total: articleData.count,
                onChange: (page) => {
                    setParams({
                        ...params,
                        page,
                    })
                },
            }}
            style={{
                background:'#f0f2f5',
            }}
            dataSource={articleData.list}
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
                            avatar={<Avatar size={45} src={art.avatar === '' ? avatarSrc+'guest.png' : avatarSrc+art.avatar} /> }
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