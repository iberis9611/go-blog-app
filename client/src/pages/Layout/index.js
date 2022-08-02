import { Avatar, Col, Input, Layout, Menu, Row, message, Popconfirm } from "antd"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react"
import { useStore } from "@/store"
import { observer } from 'mobx-react-lite'
import './index.scss'
import { getToken } from "@/utils"

const {Header, Content, Footer} = Layout
const {Search} = Input

function MyLayout() {
    
    const {loginStore, userStore}= useStore()
    const navigate = useNavigate()

    // 当给useEffect传空数组（空依赖项）时，这里的回调函数仅执行一次
    useEffect(() => {
        userStore.getUserInfo()
    }, [userStore])
    const {avatarSrc} = userStore
    const {nickname, avatar} = userStore.userInfo

    const cancel = () => {
        message.error('取消退出')
    }
    const confirm = () => {
        loginStore.logout() // 移除token
        navigate('/login') // 跳转
        message.success('退出成功！')
    }

    const userItems = [
        {
            label: <Link to={'/'}>首页</Link>,
            key: 'home',
        },
        {
            label: <Link to={'/trending'}>热门</Link>,
            key: 'trending',
        },
        {
            label: '内容管理',
            key: 'contents',
            children:[
                {
                    label: <Link to={'/published'}>我的文章</Link>,
                    key: 'published',
                },
                {
                    label: <Link to={'/publish'}>发布文章</Link>,
                    key: 'publish',
                },
            ],
        },
        {
            label: <Link to={'/message'}>私信</Link>,
            key: 'message',
        },
        {
            label: '设置',
            key: 'setting',
            children:[
                {
                    label: <Link to={'/setting'}>修改昵称</Link>,
                    key: 'changeNickname',
                },
                {
                    label: <Link to={'/setting'}>修改密码</Link>,
                    key: 'changePassword',
                },
                {
                    label: <Link to={'/setting'}>注销账户</Link>,
                    key: 'deactivateAccount',
                },
            ],
        },
        {
            label: <Popconfirm
                        title="确认退出吗？"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="确认"
                        cancelText="取消"
                    >
                        退出
                    </Popconfirm>,
            key: 'logout',
        }
    ]

    const onSearch = (value) => console.log(value)
    const [current, setCurrent] = useState('home')

    const onClick = (e) => {
        console.log('click ', e)
        setCurrent(e.key)
    }
    const token = getToken()
    const gotoProfile = () => {
        navigate(`/profile/${token}`)
    }

    return (
        <Layout style={{minHeight:"100%"}}>
            <Header className="header">
                <Row>
                    <Col className="logo" span={5} />
                    <Col className="menu" span={19}>
                        <Search
                            placeholder="请输入内容"
                            allowClear
                            enterButton="搜索"
                            size="large"
                            onSearch={onSearch}
                        />
                        <Menu 
                            onClick={onClick} 
                            selectedKeys={[current]} 
                            mode="horizontal" 
                            items={userItems} 
                        />
                        {
                        avatar === "" ?
                        <Avatar className="header-avatar" size={45} icon={<UserOutlined />} onClick={()=>gotoProfile()} />
                        :
                        <Avatar className="header-avatar" size={45} src={avatarSrc + avatar} onClick={()=>gotoProfile()} />
                        }
                        <span className="header-uname">{nickname}</span>
                    </Col>
                </Row>
            </Header>
            <Content className="content" style={{position:"relative"}}>
                {/* 二级路由出口 */}
                <Outlet />
            </Content>
            <Footer
                style={{
                    textAlign:'center'
                }}
            >
                Iberis Blog ©2022 Created by Iberis9611
            </Footer>
        </Layout>
    )
}

export default observer(MyLayout)