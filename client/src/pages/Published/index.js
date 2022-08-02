
import { Divider, Table, Space, Card, Button, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { http } from '@/utils'
const { confirm } = Modal

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    // render: (text) => <Link to={`/published/`}>{text}</Link>,
  },
  {
    title: '内容',
    dataIndex: 'content',
  },
  {
    title: '封面',
    dataIndex: 'cover',
  },
]

function Published() {

  const navigate = useNavigate()
  const {articleStore} = useStore()
  // 获取文章
  const [articleList, setArticleList] = useState([])
  const loadArticleList = async () => {
    const res = await http.get(`articlePublished?uuid=${localStorage.token}`)
    setArticleList(res.data)
  }
  useEffect(()=>{
    loadArticleList()
  }, [articleList])

  // 设置修改、删除按钮是否可用
  const [modifyDisabled, setModifyDisabled] = useState(true)
  const [deleteDisabled, setDeleteDisabled] = useState(true)
  // 设置需要修改和删除的文章aid
  const [modifyAid, setModifyAid] = useState('')
  const [deleteAid, setdeleteAid] = useState('')

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      if (selectedRows.length === 0 ) {
        setModifyDisabled(true)
        setDeleteDisabled(true)
      }
      if (selectedRows.length === 1) {
        setModifyDisabled(false)
        setDeleteDisabled(false)
        setModifyAid(selectedRowKeys)
        setdeleteAid(selectedRowKeys)
      }
      if (selectedRows.length > 1) {
        setModifyDisabled(true)
        setDeleteDisabled(false)
        setdeleteAid(selectedRowKeys)
      }
    }
  }
  
  const clickModify = () => {
    // 跳转到修改页面
    navigate(`/publish?aid=${modifyAid}`)
  }
 
  const clickDelete = () => {
    // 弹框 确认删除
    confirm({
      title: '确定删除所选内容吗？',
      icon: <ExclamationCircleOutlined />,
      content: '内容删除后，不可恢复。',
      okText:'确定',
      cancelText:'取消',

      onOk() {
        // 调用删除接口
        articleStore.delArticle({aids: deleteAid})
      },
  
      onCancel() {
        console.log('cancel')
      },
    })
  }

 
  return (
      <Card>
        <Space>
          <Button type='dashed' disabled={modifyDisabled} onClick={()=>clickModify()}>修改</Button>
          <Button type='dashed' disabled={deleteDisabled} onClick={()=>clickDelete()}>删除</Button>
        </Space>
        <Divider />
        <Table
          rowKey={row => row.aid}
          rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          }}
          columns={columns}
          dataSource={articleList}
        />
      </Card>
  )
}

export default Published