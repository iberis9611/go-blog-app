import { WomanOutlined, ManOutlined, LikeOutlined, MessageOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Row, Typography, Space, Statistic, Button, Tabs, List } from "antd"
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useStore } from "@/store"
import { getToken } from "@/utils"
import { http } from '@/utils'
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
    
    const { uuid } = useParams("uuid")
    const { userStore } = useStore()
    const myToken = getToken()
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({})
    const [currentToken, setCurrentToken] = useState('')

    // 加载名片
    const loadUserNameCard = async () => {
        const res = await http.get(`/user/people/${uuid}`)
        setUserInfo(res.data)
        setCurrentToken(res.data.token)
    }
    useEffect(()=>{
        loadUserNameCard()
    },[])
    const {
        avatar, nickname, intro, gender, address, birthday, following, follower,
        like_received, article_published, article_liked, article_saved
    } = userInfo

    // 内容控制
    const [param, setParam] = useState('Published')
    const [articleList, setArticleList] = useState([])
    const loadArticleList = async () => {
        const res = await http.get(`/article${param}?uuid=${uuid}`)
        setArticleList(res.data)
        console.log(res.data)
    }
    useEffect(() => {
        loadArticleList()
    }, [param])

    // 切换面板
    const onTabsChange = (key) => {
        if (key === 'article_published' ) {
            setParam('Published')
        }
        if (key === 'article_liked' ) {
            setParam('Liked')
        }
        if (key === 'article_saved' ) {
            setParam('Saved')
        }
    }

    // 点击文章跳转
    const clickArticle = (art) => {
        navigate(`/article/${art.aid}`)
    }

    return (
        <>
        <Card className="userWrapper" style={{margin:'5px 10px'}}>
            <Row>
                <Col span={5}>
                    <Avatar shape='square' size={128} src={userStore.avatarSrc+avatar} style={{display:'block', float:'right', marginRight:'22px'}} />
                </Col>
                <Col span={12}>
                    <Title level={3}>{nickname}</Title>
                    <Space direction="vertical">
                    <Text>{gender==='f'&&<WomanOutlined style={{color:'pink'}}/>}{gender==='m'&&<ManOutlined style={{color:'pink'}}/>}{' '+address}</Text>
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
                    { currentToken === myToken ? 
                    <Button block href="/modify">编辑资料</Button>
                    :
                    <>
                    <Button block type="primary">关注</Button>
                    <Button block href="/message" style={{marginTop:'10px'}}>发私信</Button>
                    </>
                    }
                </Col>
            </Row>
        </Card>
        <Card className="userContent" style={{margin:'5px 10px'}}>
            <Tabs defaultActiveKey="1" onChange={onTabsChange} className='tabWrapper'>
                <TabPane tab={'文章 ' + article_published} key='article_published'/>
                <TabPane tab={'点赞 ' + article_liked} key='article_liked' />
                <TabPane tab={'收藏 ' + article_saved} key='article_saved' />
            </Tabs>
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
                                    avatar={<Avatar size={45} src={userStore.avatarSrc+art.avatar} />}
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

export default Profile