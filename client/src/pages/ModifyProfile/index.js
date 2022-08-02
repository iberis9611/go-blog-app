import { Card, Button, Form, Input, Select, Cascader, DatePicker, Upload, Modal, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { residences } from '@/components'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import ImgCrop from 'antd-img-crop'
import moment from 'moment'
import './index.scss'
import { http } from '@/utils'
/* eslint-disable react-hooks/exhaustive-deps */

const { Option } = Select
//   把图片转化为base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
})

const getBase64b = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function formatGender(gender) {
    if (gender === 'm') {return '男'}
    if (gender === 'f') {return '女'}
    if (gender === 'o') {return '保密'}
}

function ModifyProfile() {

    const { userStore } = useStore()
    const navigate = useNavigate()

    // 上传头像的实现
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState()
    const [previewVisible, setPreviewVisible] = useState(false) // 控制预览框的显示状态
    const [previewImage, setPreviewImage] = useState('') // 图片内容
    const [previewTitle, setPreviewTitle] = useState('') // 图片名称
    const [avatarUrl, setAvatarUrl] = useState('') // antanhou 上传图片后 后端返回的url
    // const [fileList, setFileList] = useState([])
    const form = useRef(null)

    const loadDetail = async () => {
        const res = await http.get('user/profile')
        console.log(res.data)
        const {intro, gender, birthday, email, phone, address} = res.data
        // 表单数据回显
        form.current.setFieldsValue({
            "intro": intro,
            "gender": formatGender(gender), // 用formatGender()把字符串转换为对应的性别
            "birthday": moment(birthday), // DatePicker只支持moment类型的数据
            "email": email,
            "phone": phone,
            "address": address,
        })
        // 图片回显
        // setFileList({avatar})
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
    const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div
            style={{
              marginTop: 8,
            }}
          >
            上传
          </div>
        </div>
      )
    // 点击移除图片触发
    const onRemove = () => setImageUrl()

    // 上传回调
    const onChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        
        if (info.file.status === 'done') {
            // 图片上传成功后 拿到后端返回的url
            setAvatarUrl(info.file.response.data)
            setLoading(false)
            // save avatar in localStorage
            // localStorage.setItem("user-avatar", info.file.response.data.avatar)
            getBase64b(info.file.originFileObj, (url) => {
                setLoading(false)
                setImageUrl(url)
            })
        }
    }

    // 提交表单
    const onFinish = async (values) => {
        const {birthday,email,gender,intro,phone,address} = values
        const params = {
            birthday,
            email,
            gender,
            intro,
            phone,
            address: address === undefined ? '' : address.join('-'),
            avatar: avatarUrl
        }
        try {
            await userStore.modifyProfile(params)
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
                            onChange={onChange}
                            onPreview={onPreview}
                            onRemove={onRemove}
                            // fileList={fileList}
                        >
                            {imageUrl ? null :uploadButton}
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
                    <Option value="m">男</Option>
                    <Option value="f">女</Option>
                    <Option value="o">保密</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="birthday"
                    label="生日"
                    hasFeedback
                >
                    <DatePicker placeholder='选择日期' style={{display:"flex"}} />
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
                        message: '请选择您的所在地！',
                    },
                    ]}
                    hasFeedback
                >
                    <Cascader options={residences} />
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