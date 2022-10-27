import { LikeFilled, DislikeFilled, MenuOutlined, PlusOutlined, MessageOutlined, EyeOutlined, ClockCircleOutlined, LikeOutlined, DislikeOutlined, StarOutlined } from '@ant-design/icons'
import { Avatar, Card, Button, Space, Tabs, Input, Divider, Row, Col, Statistic, List, Comment, message, Typography } from "antd"
import { styleFocus, styleBlur, styleGray, styleBlue, styleFollow } from '@/styles'
import React, { useState, useEffect, createElement } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { getToken } from '@/utils'
import moment from 'moment'
import './index.scss'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
// 导入中间件 连接mobx和react 完成响应式变化

// Disable eslint's warning
/* eslint-disable react-hooks/exhaustive-deps */

const { Title, Text } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

// 文章详情页
function Article() {

    const {aid} = useParams() // 获取URL中参数id的值
    const token = getToken() // 获取当前用户的token值
    const navigate = useNavigate()
    const {articleStore, commentStore, userStore, messageStore} = useStore()
    
    useEffect(()=>{
        articleStore.getArticle({aid: aid})
        commentStore.getComment({aid: aid})
    },[])

    const {title, content, view_count, create_at, like_count, save_status, like_status,
        user_uuid, nickname, intro, article_published, like_received, follower, avatar, follow_status} = articleStore.article

    const commentCountDisplayed = <span>{commentStore.commentlist.length} 条评论</span> // 显示评论数量
    const [commentContent, setCommentContent] = useState('') // 控制输入框中内容

    // 赞文章
    const toggleLike = async() => {
        // 触发点赞方法
        await articleStore.likeArticle({item_id: aid})
        await articleStore.getArticle({aid: aid})
    }
    // 踩文章
    const toggleDisLike = async() => {
        await articleStore.dislikeArticle({item_id: aid})
        await articleStore.getArticle({aid: aid})
    }
    // 收藏文章
    const clickSave = async() => {
        await articleStore.saveArticle({aid: aid})
        await articleStore.getArticle({aid: aid})
    }
    // 关注作者
    const toggleFollow = async() => {
        await userStore.followAuthor({follow_uuid: user_uuid})
        await articleStore.getArticle({aid: aid})
    }
    // 发布评论
    const addComment =  async() => {
        if (commentContent==='') {
            message.warning('请先输入内容')
        } else {
            // 新增
            await commentStore.postComment({
                comment_content: commentContent,
                sent_from: token,
                sent_to: user_uuid,
                article_aid: aid,
            })
            // 刷新
            await commentStore.getComment({aid:aid})
            setCommentContent('') // 清空文本域
            message.success('发布评论成功！')
        }
    }
    // 删除评论
    const removeComment = async(comment) => {
        await commentStore.deleteComment({cid: comment.cid})
        await commentStore.getComment({aid:aid})
        message.success('删除评论成功！')
    }
    // 赞评论
    const thumbUp = async(comment) => {
        await commentStore.likeComment({item_id: comment.cid})
        await commentStore.getComment({aid:aid})
    }
    // 踩评论
    const thumbDown = async(comment) => {
        await commentStore.dislikeComment({item_id: comment.cid})
        await commentStore.getComment({aid:aid})
    }
    // 点击头像 跳转至个人中心
    const gotoProfile = () => {
        navigate(`/profile/${user_uuid}`)
    }
    // 获得tab的key值，实现tab变换
    const onChange = (key) => {
        console.log(key)
    }
    // 发私信
    const dm = async() => {
        await messageStore.addChat({
            user_uuid:token,
            to_uuid: user_uuid,
            chat_nickname:nickname,
            chat_avatar:avatar,
            message_type: 1,
        })
        // 设置历史保存同一窗口或标签页的数据
        sessionStorage.setItem("friend_uuid", user_uuid)
        navigate('/message')
    }

    return (
        <div className="mainWrapper">
            {/* 左边栏 */}
            <Card className="articleWrapper">
                {/* 文章内容 */}
                <div className="articleTitle">
                    <h1>{title}</h1>
                    <Space>
                        <span><EyeOutlined /> {view_count}</span>
                        <span><ClockCircleOutlined /> {moment(create_at).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </Space>
                </div>
                <div className="article">{content}</div>
                {/* 点赞 收藏条 */}
                <div className="likesPanel">
                    <Space>
                        <Button
                            type="primary"
                            icon={<LikeOutlined />}
                            onClick={() => toggleLike()}
                            style={like_status === 1 ? styleFocus : styleBlur}
                            className="likeButton"
                        >
                            {like_status === 1 ? '已点赞' : '点赞'} {like_count}
                        </Button>
                        <Button
                            type="primary"
                            icon={<DislikeOutlined />}
                            onClick={() => toggleDisLike()}
                            style={like_status === -1 ? styleFocus : styleBlur}
                            className="dislikeButton"
                        />
                        <Button 
                            icon={<StarOutlined />}
                            onClick={() => clickSave()}
                            style={save_status === 1 ? styleBlue : styleGray}
                        >
                            {save_status === 1 ? '已收藏' : '收藏'}
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
                            // loading={commentStore.isLoading}
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
                                <Avatar shape="square" size={78} src={userStore.avatarSrc + avatar}/>
                            </Card.Grid>
                        </Col>
                        <Col span={17}>
                            <Title level={4}>{nickname}</Title>
                            <Text type='secondary'>{intro}</Text>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic title="文章" value={article_published} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="粉丝" value={follower} />
                        </Col>
                        <Col span={8}>
                            <Statistic title="获赞" value={like_received} />
                        </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                        {
                        user_uuid !== token ?
                            <>
                            <Col span={12}>
                                <Button
                                    block
                                    type="primary"
                                    onClick={() => toggleFollow()}
                                    style={follow_status === 1 ? styleFollow : styleFocus}
                                    icon={follow_status === 1 ? <MenuOutlined /> : <PlusOutlined />}
                                >
                                    {follow_status === 1 ? '已关注' : '关注'}
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    block
                                    icon={<MessageOutlined />}
                                    onClick={()=>dm()}
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