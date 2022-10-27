import { WomanOutlined, ManOutlined, LikeOutlined, MessageOutlined, StarOutlined, EyeOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Row, Typography, Space, Statistic, Button, Tabs, List } from "antd"
import { styleFocus, styleFollow } from '@/styles'
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useStore } from "@/store"
import { getToken } from "@/utils"
import { http } from '@/utils'
import {observer} from 'mobx-react-lite'
import moment from 'moment'
import './index.scss'
/* eslint-disable react-hooks/exhaustive-deps */

const { Title, Text } = Typography
const { TabPane } = Tabs
const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
)
    
function Profile() {
    
    // 获取被查看用户的uuid
    const { uuid } = useParams("uuid")
    
    // 获取登录用户的uuid
    const myToken = getToken()
    const navigate = useNavigate()
    const { userStore, messageStore } = useStore()
    useEffect(()=>{
        userStore.getUserNameCardByUuid({uuid: uuid})
    },[])
    // 解构用户信息
    const { avatar, nickname, intro, gender, address, birthday, following, follower, like_received, article_published, article_liked, article_saved, follow_status } = userStore.nameCard
    // 关注作者
    const toggleFollow = async() => {
        await userStore.followAuthor({follow_uuid: uuid})
        await userStore.getUserNameCardByUuid({uuid: uuid})
    }

    // 内容控制
    const [seachType, setSearchType] = useState('published') // 文章类型：自己发布的/点赞的/收藏的
    const [articleData, setArticleData] = useState({ // 文章列表
        list: [],
        count: 0,
    }) 
    const [params, setParams] = useState({ // 分页
        page: 1,
        per_page: 5,
    })
    const loadArticleList = async () => {
        const res = await http.get(`/articleList?search_type=${seachType}&uuid=${uuid}&page=${params.page}&per_page=${params.per_page}`)
        const { result, total_count} = res.data
        setArticleData({
            list: result,
            count: total_count,
        })
    }
    useEffect(() => {
        loadArticleList()
    }, [seachType, params])

    // 切换面板
    const onTabsChange = (key) => {
        if (key === 'article_published' ) {
            setSearchType('published')
        }
        if (key === 'article_liked' ) {
            setSearchType('liked')
        }
        if (key === 'article_saved' ) {
            setSearchType('saved')
        }
    }

    // 发私信
    const dm = async() => {
        await messageStore.addChat({
            user_uuid: myToken,
            to_uuid: uuid,
            chat_nickname: nickname,
            chat_avatar: avatar,
            message_type: 1,
        })
        // 设置历史保存同一窗口或标签页的数据
        sessionStorage.setItem("friend_uuid", uuid)
        navigate('/message')
    }

    // 点击文章跳转
    const clickArticle = (art) => {
        navigate(`/article/${art.aid}`)
    }

    return (
        <>
        {/* 用户信息区 */}
        <Card className="userWrapper" style={{margin:'5px 10px'}}>
            <Row>
                <Col span={5}>
                    <Avatar 
                        shape='square' 
                        size={128} 
                        src={avatar === '' ? userStore.avatarSrc+'guest.png' :userStore.avatarSrc+avatar} 
                        style={{display:'block', float:'right', marginRight:'22px'}} 
                    />
                </Col>
                <Col span={12}>
                    <Title level={3}>{nickname}</Title>
                    <Space direction="vertical">
                    <Text>{gender==='女'&&<WomanOutlined style={{color:'pink'}}/>}{gender==='男'&&<ManOutlined style={{color:'blue'}}/>}{' '+address}</Text>
                    <Text>{moment(birthday).format('YYYY-MM-DD')}</Text>
                    <Text type='secondary'>{intro}</Text>
                    </Space>
                </Col>
                <Col span={4}>
                    <Row style={{textAlign:'center'}}>
                        <Col span={8}>
                        <Statistic title="获赞" value={like_received} />
                        </Col>
                        <Col span={8}>
                        <Statistic title="关注" value={following} />
                        </Col>
                        <Col span={8}>
                        <Statistic title="粉丝" value={follower} />
                        </Col>
                    </Row>
                    { uuid === myToken ? 
                    <Button block href="/modify">编辑资料</Button>
                    :
                    <>
                    <Button 
                        block 
                        type="primary"
                        onClick={() => toggleFollow()}
                        style={follow_status === 1 ? styleFollow : styleFocus}
                        icon={follow_status === 1 ? <MenuOutlined /> : <PlusOutlined />}
                    >
                        {follow_status === 1 ? '已关注' : '关注'}
                    </Button>
                    <Button block style={{marginTop:'10px'}} onClick={()=>dm()}>发私信</Button>
                    </>
                    }
                </Col>
            </Row>
        </Card>
        {/* 文章展示区 */}
        <Card className="userContent" style={{margin:'5px 10px'}}>
            {/* 切换条 */}
            <Tabs defaultActiveKey="1" onChange={onTabsChange} className='tabWrapper'>
                <TabPane tab={ '文章 ' + article_published } key='article_published'/>
                <TabPane tab={ '点赞 ' + article_liked } key='article_liked' />
                <TabPane tab={ '收藏 ' + article_saved } key='article_saved' />
            </Tabs>
            {/* 文章列表 */}
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
                                onClick={()=>clickArticle(art)}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar size={45} src={art.avatar==='' ? userStore.avatarSrc+'guest.png' : userStore.avatarSrc+art.avatar} />}
                                    title={art.title}
                                    description={art.author}
                                />
                                {art.content}
                            </List.Item>
                    </Card.Grid>
                )}
            />
        </Card>
        </>
    )
}

export default observer(Profile)