import { Card, Checkbox, Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import './index.scss'

function Login() {

    const {loginStore}= useStore()
    const navigate = useNavigate() // 导航函数，可以完成跳转

    // 通过onFinish拿到用户输入的数据
    const onFinish = async (values) => {
        // values放置的是所有表单项中用户输入的内容，从中解构出用户输入的username和password
        const {username, password} = values
        try{
            // 登录，把用户输入的un和pwd填入getToken方法
            await loginStore.getToken({username, password})
            // 跳转首页
            navigate('/')
            // 提示用户
            message.success('登陆成功')
        } catch (e) {
            message.error('登录失败')
        }
    }

    // 数据提交失败时，抛出的回调事件
    // const onFinishFailed = (errInfo) => {
    //     message.error('登录失败')
    // }

    return (
        <div className='login'>
            <Card hoverable title="用户登录" className="login-container">
            <Form
                validateTrigger={['onBlur', 'onChange']}
                name="basic"
                // 栅格系统中的列是指 1 到 24 的值来表示其跨越的范围。
                wrapperCol={{
                    span: 18,
                    offset: 3,
                }}
                initialValues={{
                    remember: true,
                }}
                autoComplete="off"
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    name="username"
                    // tooltip="用户名可由数字、字母（区分大小写）和下划线组成。长度不得少于3位，大于16位，且第一位只能是字母。"
                    rules={[
                    {
                        required: true,
                        message: '请输入您的用户名!',
                    },
                    {
                        pattern: /^[a-zA-Z][\w]{2,15}$/,
                        message: '用户名格式不正确！',
                        validateTrigger:'onBlur',
                    },
                    ]}
                    hasFeedback
                >
                    <Input placeholder='用户名' />
                </Form.Item>

                <Form.Item
                    name="password"
                    // tooltip="密码应可由数字、字母（区分大小写）、下划线以及特殊字符“?、!、@、#、$、%、-”组成，且长度不得小于8位，大于20位。"
                    rules={[
                    {
                        required: true,
                        message: '请您的输入密码!',
                    },
                    {
                        pattern:/^[?!@#$%a-zA-Z0-9_-]{8,20}$/,
                        message:'密码格式不正确！',
                        validateTrigger:'onBlur',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder='密码' />
                </Form.Item>
                    
                <Form.Item
                    name='remember'
                    valuePropName='checked'
                >
                    <Checkbox>记住我</Checkbox>
                    <Link className='forgetPassword' to={'/'}>忘记密码</Link>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" size="large" className="loginBtn">
                    登录
                    </Button>
                    <Link to={'/register'} className="registerBtn">没有账号，点此注册</Link>
                </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login