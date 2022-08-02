import { Card, Form, Button, Input, Upload, message } from 'antd'
import { useEffect, useRef } from 'react'
import { useStore } from '@/store'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ImgCrop from 'antd-img-crop'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { http } from '@/utils'
/* eslint-disable react-hooks/exhaustive-deps */

function Publish() {

    const [params] = useSearchParams()
    const aid = params.get('aid')
    const { articleStore } = useStore()
    const navigate = useNavigate()
    const form = useRef(null)
    
    const loadDetail = async () => {
        const res = await http.get(`/articleSimple/${aid}`)
        console.log(res.data)

        const {title, content} = res.data
        // 表单数据回显
        form.current.setFieldsValue({
            "title": title,
            "content": content
        })
        // 图片回显
        // setFileList({avatar})
    } 
    useEffect(() => {
        loadDetail()
    }, [])

    // 提交表单
    const onFinish = async (values) => {
        const {title, content} = values
        if (aid) {
            // 修改逻辑
            try {
                await articleStore.modifyArticle({
                    aid: aid,
                    title: title,
                    content: content,
                })
                navigate('/published')
                message.success('修改成功！')
            } catch (e) {
                message.error(e.response?.data?.message ||'发生错误，注册失败！')
            }
        } else {
            // 发布逻辑
            try {
                await articleStore.publishArticle({
                    title: title,
                    content: content,
                })
                navigate('/published')
                message.success('发布成功！')
            } catch (e) {
                message.error(e.response?.data?.message ||'发生错误，注册失败！')
            }
        }
    }

    return (
        <Card title={aid ? '编辑文章' : '发布文章'}>
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
                <Form.Item
                    name="title"
                    label="标题"
                    rules={[
                        {
                            required: true,
                            message: '请输入标题！',
                            whitespace: true,
                        },
                    ]}
                    hasFeedback
                >
                    <Input placeholder='请输入文章标题' />
                </Form.Item>
                <Form.Item label="上传封面">
                    <ImgCrop rotate>
                        <Upload
                            name="file"
                            listType="picture-card"
                            action="http://localhost:8000/file/upload"
                            headers={{"Authorization": "Bearer " + localStorage.getItem("pc-key")}}
                        >
                            
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item
                    name="content"
                    label="内容"
                    rules={[
                        {
                            required: true,
                            message: '请输入内容！',
                            whitespace: true,
                        },
                    ]}
                    hasFeedback
                >
                    <ReactQuill theme='snow' placeholder='请输入文章内容' />
                </Form.Item>
                <Form.Item wrapperCol={{offset: 11, span:2}}>
                    <Button type="primary" htmlType="submit">
                        {aid ? '提交' : '发布'}
                    </Button>
                </Form.Item>    
            </Form>
        </Card>
    )
}

export default Publish