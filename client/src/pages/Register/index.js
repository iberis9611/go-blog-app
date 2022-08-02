import { Card, Button, Form, Input, Checkbox, message } from 'antd'
import { tailFormItemLayout, tailFormButtonLayout } from '@/components'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { v4 as uuid } from 'uuid'
import './index.scss'

function Register() {
    
    const { registerStore } = useStore()
    const navigate = useNavigate()

    const currentTime = new Date()
    const token = uuid()

    // 提交表单
    const onFinish = async (values) => {
        const {username,password,nickname} = values
        const params = {
            username,
            password,
            nickname,
            token: token,
            create_at: currentTime
        }
        try {
            await registerStore.register(params)
            navigate('/modify')
            message.success('注册成功！')
        } catch (e) {
            message.error(e.response?.data?.message ||'发生错误，注册失败！')
        }
    }

    return (
        <Card className='registerWrapper' style={{margin:"0 75px"}} title="用户注册">
            <Form
                validateTrigger={['onBlur','onChange']}
                labelCol={{
                    span:3,
                }}
                wrapperCol={{
                    span:20,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    tooltip="用户名可由数字、字母（区分大小写）和下划线组成。长度不得少于3位，大于16位，且第一位只能是字母。"
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
                    <Input 
                        // value={usernameValue}
                        // onChange={(e)=>setUsernameValue(e.target.value)}
                        // onBlur={()=>validateUsername()} 
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    tooltip="密码应可由数字、字母（区分大小写）、下划线以及特殊字符“?、!、@、#、$、%、-”组成，且长度不得小于8位，大于20位。"
                    rules={[
                    {
                        required: true,
                        message: '请输入您的密码！',
                    },
                    {
                        pattern:/^[?!@#$%a-zA-Z0-9_-]{8,20}$/,
                        message:'密码格式不正确！',
                        validateTrigger:'onBlur',
                    },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: '请确认您的密码！',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject(new Error('您输入的两个密码不匹配！'));
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="nickname"
                    label="昵称"
                    tooltip="您希望其他用户如何称呼您"
                    rules={[
                    {
                        required: true,
                        message: '请输入您的昵称！',
                        whitespace: true,
                    },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                    {
                        validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('请先已阅读并同意「用户协议」和「隐私条款」！')),
                    },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
                </Form.Item>
                <Form.Item {...tailFormButtonLayout}>
                    <Button block type="primary" htmlType="submit" className='confirmBtn' >
                        确认注册
                    </Button> 
                    <Link to={'/login'} className="loginBtn">返回登录界面</Link>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default Register