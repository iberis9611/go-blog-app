import { LikeFilled, DislikeFilled, MenuOutlined, PlusOutlined, MessageOutlined, EyeOutlined, ClockCircleOutlined, LikeOutlined, DislikeOutlined, StarOutlined } from '@ant-design/icons'
import { Avatar, Card, Button, Space, Tabs, Input, Divider, Row, Col, Statistic, List, Comment, message, Typography } from "antd"
import { styleFocus, styleBlur, styleGray, styleBlue, styleFollow } from '@/styles'
import React, { useState, useEffect, createElement } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken } from '@/utils'
import { useStore } from "@/store"
import moment from 'moment'
import './index.scss'
import {observer} from 'mobx-react-lite'
// 导入中间件 连接mobx和react 完成响应式变化

// Disable eslint's warning
/* eslint-disable react-hooks/exhaustive-deps */

const { Title, Text } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

// 文章详情页
function Article() {

    const {userStore, articleStore, commentStore} = useStore()
    const {aid} = useParams() // 获取URL中参数id的值
    const token = getToken() // 获取当前用户的token值
    const navigate = useNavigate()
    
    articleStore.getArticle({aid: aid}) // 获取文章对象
    commentStore.getComment({aid: aid}) // 获取评论列表（：前的后端规定的参数名，：后的是要传入的参数）
    userStore.getUserNameCard({aid: aid}) // 获取作者信息

    const commentCountDisplayed = <span>{commentStore.commentlist.length} 条评论</span> // 显示评论数量
    const [commentContent, setCommentContent] = useState('') // 控制输入框中内容
    const [currentToken, setCurrentToken] = useState('')
    useEffect(()=>{
        setCurrentToken(userStore.nameCard.token)
    },[])

    // 赞文章
    const toggleLike = () => {
        articleStore.likeArticle({item_id: aid})
    }
    // 踩文章
    const toggleDisLike = () => {
        articleStore.dislikeArticle({item_id: aid})
    }
    // 收藏文章
    const clickSave = () => {
        articleStore.saveArticle({aid: aid})
        console.log(articleStore.article.save_status)
    }
    // 关注作者
    const toggleFollow = () => {
        userStore.followAuthor({aid: aid})
    }
    // 发布评论
    const addComment =  () => {
        if (commentContent==='') {
            message.warning('请先输入内容')
        } else {
            commentStore.postComment({
                comment_content: commentContent,
                sent_from: token,
                sent_to: articleStore.article.user_uuid,
                article_aid: articleStore.article.aid,
            })
            setCommentContent('') // 清空文本域
            message.success('发布评论成功！')
        }
    }
    // 删除评论
    const removeComment = (comment) => {
        commentStore.deleteComment({cid: comment.cid})
        message.success('删除评论成功！')
    }
    // 赞评论
    const thumbUp = (comment) => {
        commentStore.likeComment({item_id: comment.cid})
    }
    // 踩评论
    const thumbDown = (comment) => {
        commentStore.dislikeComment({item_id: comment.cid})
    }
    // 点击头像 跳转至个人中心
    const gotoProfile = () => {
        navigate(`/profile/${articleStore.article.user_uuid}`)
    }
    // 获得tab的key值，实现tab变换
    const onChange = (key) => {
        console.log(key)
    }

    return (
        <div className="mainWrapper">
            {/* 左边栏 */}
            <Card className="articleWrapper">
                {/* 文章内容 */}
                <div className="articleTitle">
                    <h1>{articleStore.article.title}</h1>
                    <Space>
                        <span><EyeOutlined /> {articleStore.article.view_count}</span>
                        <span><ClockCircleOutlined /> {moment(articleStore.article.create_at).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </Space>
                </div>
                <div className="article">{articleStore.article.content}</div>
                {/* 点赞 收藏条 */}
                <div className="likesPanel">
                    <Space>
                        <Button
                            type="primary"
                            icon={<LikeOutlined />}
                            onClick={() => toggleLike()}
                            style={articleStore.article.like_status === 1 ? styleFocus : styleBlur}
                            className="likeButton"
                        >
                            {articleStore.article.like_status === 1 ? '已点赞' : '点赞'} {articleStore.article.like_count}
                        </Button>
                        <Button
                            type="primary"
                            icon={<DislikeOutlined />}
                            onClick={() => toggleDisLike()}
                            style={articleStore.article.like_status === -1 ? styleFocus : styleBlur}
                            className="dislikeButton"
                        />
                        <Button 
                            icon={<StarOutlined />}
                            onClick={() => clickSave()}
                            style={articleStore.article.save_status === 1 ? styleBlue : styleGray}
                        >
                            {articleStore.article.save_status === 1 ? '已收藏' : '收藏'}
                        </Button>
                    </Space>
                </div>
                {/* 评论区 */}
                <Tabs  
                    className="comment"
                    defaultActiveKey="1" 
                    tabBarExtraContent={commentCountDisplayed} 
                    // style={commentFlag ? {display:'block'} : {display:'none'} }
                    onChange={onChange}
                >
                    <TabPane tab="默认" key="1">
                        {/* 发布评论框 */}
                        <div 
                            className="commentEditor" 
                            style={{
                                display:'flex',
                                padding:'16px 0'
                            }}
                        >
                            <div className="commentAvatar"><Avatar size="middle" src={userStore.avatarSrc + userStore.userInfo.avatar} /></div>
                            <TextArea 
                                placeholder="写评论" 
                                autoSize 
                                style={{margin:"0 12px"}}
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <Button type="primary" onClick={()=>addComment()}>发布</Button>
                        </div>
                        {/* 评论展示区 */}
                        <List
                            className="comment-list"
                            itemLayout="horizontal"
                            dataSource={commentStore.commentlist}
                            renderItem={(comment) => (
                            <li>
                                <Comment
                                // actions: 在评论内容下面呈现的操作项列表
                                actions={[
                                    // 点赞按钮
                                    <span key="comment-basic-like" onClick={()=>thumbUp(comment)}>
                                        {createElement(comment.attitude === 1 ? LikeFilled : LikeOutlined)}
                                        <span>{comment.like_count}</span>
                                    </span>,
                                    // 点踩按钮
                                    <span key="comment-basic-dislike" style={{paddingLeft:'12px'}} onClick={()=>thumbDown(comment)}>
                                        {React.createElement(comment.attitude === -1 ? DislikeFilled : DislikeOutlined)}
                                    </span>,
                                    // 删除按钮出现时机：用户的token和评论的sent_from一致时
                                    token === comment.sent_from ?
                                    <Button 
                                        key="comment-removal" 
                                        type="text" size="small" 
                                        style={{paddingLeft:'12px', color:'#A9A9A9'}} 
                                        // 传参item
                                        onClick={() => removeComment(comment)}
                                    >
                                        删除
                                    </Button>
                                    : ''
                                  ]}
                                author={comment.nickname}
                                avatar={userStore.avatarSrc + comment.avatar}
                                content={comment.comment_content}
                                datetime={<span>{moment(comment.create_at).fromNow()}</span>}
                                />
                            </li>
                            )}
                        />
                    </TabPane>
                    <TabPane tab="最新" key="2">
                        <br />Content of Tab Pane 2
                    </TabPane>
                </Tabs>
            </Card>
            {/* 右边栏 */}
            <div className="rightPanel">
                <Card
                    title="作者信息"
                    bordered={false}
                >
                    <Row>
                        <Col span={7}>
                            <Card.Grid style={{width:'78px', height:'78px', padding:'0'}} onClick={()=>gotoProfile()}>
                                <Avatar shape="square" size={78} src={userStore.avatarSrc + userStore.nameCard.avatar}/>
                            </Card.Grid>
                        </Col>
                        <Col span={17}>
                            <Title level={4}>{userStore.nameCard.nickname}</Title>
                            <Text type='secondary'>{userStore.nameCard.intro}</Text>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic title="文章" value={userStore.nameCard.article_published} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="粉丝" value={userStore.nameCard.follower} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="获赞" value={userStore.nameCard.like_received} />
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                        {
                        currentToken !== token ?
                            <>
                            <Col span={12}>
                                <Button
                                    block
                                    type="primary"
                                    onClick={() => toggleFollow()}
                                    style={userStore.nameCard.follow_status === 1 ? styleFollow : styleFocus}
                                    icon={userStore.nameCard.follow_status === 1 ? <MenuOutlined /> : <PlusOutlined />}
                                >
                                    {userStore.nameCard.follow_status === 1 ? '已关注' : '关注'}
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    block
                                    icon={<MessageOutlined />}
                                    href="/message"
                                >
                                    发私信
                                </Button>
                            </Col>
                            </>
                            :
                            <Col span={12} offset={6}>
                                <Button block href="/modify">编辑资料</Button>
                            </Col>
                        }
                    </Row>
                </Card>
                <Card
                    title="热门文章"
                    bordered={false}
                    style={{marginTop:'12px'}}
                >
                    待续
                </Card>
            </div>
        </div>
    )
}

// export default Article
export default observer(Article)