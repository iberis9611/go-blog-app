import { Card, Button, Form, Input, Select, Cascader, DatePicker, Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { residences } from '@/components'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { http } from '@/utils'
import ImgCrop from 'antd-img-crop'
import moment from 'moment'
import './index.scss'
/* eslint-disable react-hooks/exhaustive-deps */

const { Option } = Select
// 把图片转化为base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
})

function ModifyProfile() {

    const { userStore } = useStore()
    const navigate = useNavigate()

    // 上传头像的实现
    const [previewVisible, setPreviewVisible] = useState(false) // 控制预览框的显示状态
    const [previewImage, setPreviewImage] = useState('') // 图片内容
    const [previewTitle, setPreviewTitle] = useState('') // 图片名称
    const [fileList, setFileList] = useState([]) // 存放上传图片的列表
    const [updateStatus, setUpdateStatus] = useState('') // 头像更改状态
    const [avatarUrl,setAvatarUrl] = useState('') // 用于存放默认头像
    const form = useRef(null)

    // 表单回显
    const loadDetail = async () => {
        const res = await http.get('user/profile')
        const {intro, gender, birthday, email, phone, address, avatar} = res.data
        // 表单数据回显
        form.current.setFieldsValue({
            "intro": intro,
            "gender": gender,
            // DatePicker只支持moment类型的数据，但是注册时，birthday的数据是null，datepicker会报错: invalid date
            // 这是因为moment(null) = NaN 解决办法：给birthday赋初始值undefined
            "birthday": birthday === null ? moment(undefined) : moment(birthday),
            "email": email,
            "phone": phone,
            "address": address.split('-'),
        })
        // 仅在已经有头像的情况下进行图片回显
        if (avatar!=='') {
            const myAvatar = [userStore.avatarSrc + avatar]
            setFileList(myAvatar.map(url=>{
                return {
                    url: url
                }
            }))
            setAvatarUrl(avatar) // 默认头像名称
            setUpdateStatus('default') // 表示没有改头像
        }
    } 
    useEffect(() => {
        loadDetail()
    }, [])

    // 预览已上传的图片
    // 上传回调的返回值是file对象，里面存放的是当前图片的一些信息，包括originFileObj
    const onPreview = async (file) => {
        
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj)
        }

        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }
    // 取消预览
    const handleCancel = () => setPreviewVisible(false)
    // 上传按钮
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div
            style={{
              marginTop: 8,
            }}
          >
            上传
          </div>
        </div>
    )

    const onChange = ({fileList}) => { // fileList是从结果中解构出来的
        // 采取受控的写法，在最后一次的log里有response，最终fileList中存放着response.data
        setFileList(fileList)
        setUpdateStatus('')
    }

    // 提交表单
    // 注意：这里的values是表单提交的值
    const onFinish = async (values) => {
        const {birthday,email,gender,intro,phone,address} = values
        // avatar的取值：1 在进入修改页面前已有头像，且未修改头像，则使用默认的URL；2 未上传头像/已上传新头像/删除之前的头像，则取fileList里的URL
        const params = {
            birthday,
            email,
            gender,
            intro,
            phone,
            address: address === undefined ? '' : address.join('-'),
            avatar: updateStatus === 'default' ? avatarUrl : fileList.map(item=> item.response.data)[0],
        }
        try {
            await userStore.modifyProfile(params)
            await userStore.getUserInfo() // 刷新头像显示
            navigate('/')
            message.success('编辑用户信息成功！')
        } catch (e) {
            message.error(e.response?.data?.message ||'发生错误，注册失败！')
        }
    }

    return (
        <Card title="编辑用户信息" className='modifierWrapper'>
            <Form
                validateTrigger={['onBlur','onChange']}
                labelCol={{
                    span:3,
                }}
                wrapperCol={{
                    span:19,
                }}
                onFinish={onFinish}
                ref={form}
            >
                <Form.Item label="上传头像">
                    <ImgCrop rotate>
                        <Upload
                            name="file"
                            listType="picture-card"
                            action="http://localhost:8000/file/upload"
                            headers={{"Authorization": "Bearer " + localStorage.getItem("pc-key")}}
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length >= 1 ? null :uploadButton}
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item
                    name="intro"
                    label="个人简介"
                >
                    <Input.TextArea showCount maxLength={100} />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="性别"
                    hasFeedback
                >
                    <Select placeholder="请选择性别">
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                    <Option value="其他">其他</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="birthday"
                    label="生日"
                    hasFeedback
                >
                    <DatePicker style={{display:"flex"}} />
                   {/* <DatePicker />  */}
                </Form.Item>
                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址！',
                    },
                    ]}
                    hasFeedback
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="手机号"
                    rules={[
                    {
                        required: false,
                        message: '请输入您的手机号码！',
                    },
                    {
                        pattern:/^1[3,4,5,6,7,8,9]\d{9}$/,
                        message: '请输入正确的手机号码！',
                    },
                    ]}
                    hasFeedback
                >
                    <Input
                    style={{
                        width: '100%',
                    }}
                    />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="所在地"
                    rules={[
                    {
                        type: 'array',
                        required: false,
                    },
                    ]}
                    hasFeedback
                >
                    <Cascader 
                        fieldNames={{
                            label: 'name',
                            value: 'name',
                            children: 'items',
                        }}
                        options={residences} 
                    />
                </Form.Item>
                <Form.Item className='submitModification'>
                        <Button block type="primary" htmlType="submit">确认修改</Button>
                </Form.Item>    
            </Form>
            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                alt="example"
                style={{
                    width: '100%',
                }}
                src={previewImage}
                />
            </Modal>
            <Link to={'/'}><Button block type='text'>返回首页</Button></Link>
        </Card>
    )
}

export default ModifyProfile