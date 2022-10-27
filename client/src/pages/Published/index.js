import { Divider, Table, Space, Card, Button, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import './index.scss'
import { useStore } from '@/store'
const { confirm } = Modal


const columns = [
  {
    title: '标题',
    dataIndex: 'title',
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
  const [articleData, setArticleData] = useState({
    list: [], // 文章列表
    count: 0, // 文章数量
  })
  // 文章参数
  const [params, setParams] = useState({
    page: 1,
    per_page: 5,
  })
  // 加载文章列表
  useEffect(()=>{
    const loadArticleList = async () => {
      const res = await http.get(`articleList?search_type=published&uuid=${localStorage.token}&page=${params.page}&per_page=${params.per_page}`)
      const { result, total_count } = res.data
      setArticleData({
        list: result,
        count: total_count,
      })
    }  
    loadArticleList()
  }, [params]) // 这里只要依赖发生变化，就会重新加载

  // 设置修改、删除按钮是否可用
  const [modifyDisabled, setModifyDisabled] = useState(true)
  const [deleteDisabled, setDeleteDisabled] = useState(true)
  // 设置需要修改和删除的文章aid
  const [modifyAid, setModifyAid] = useState('') // 修改一次只能一个，所以用字符串
  const [deleteAid, setdeleteAid] = useState([]) // 删除可以批量操作，所以用数组
  
  // 复选框的操作 
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
  
  // 点击发布
  const publishArticle = () => {
    navigate('/publish')
  }

  // 点击修改
  const clickModify = () => {
    navigate(`/publish?aid=${modifyAid}`) // 跳转到修改页面
  }

  // 点击不同页码
  const pageChange = (page) => { // 这里page是onChange自带的参数：function(page, pageSize)
    setParams({
      ...params, // 解构参数对象
      page, // 修改page
    })
  }

  // 删除方法
  const delArticle = async ({aids}) => {
    // 注意：由于async是异步函数，所以无法通过先使用async函数调用删除接口，再通过修改数据，调用useEffect中的async函数。
    // 这样会造成页面无法刷新，因为函数是异步的。通过在async函数中，书写多个await函数，可以实现函数的顺序执行。
    // await的含义为等待。意思就是代码需要等待await后面的函数运行完并且有了返回结果之后，才继续执行下面的代码。这正是同步的效果。
    // 1 删除
    await articleStore.delArticle({aids: aids})
    // 2 刷新
    const res = await http.get(`articleList?search_type=published&uuid=${localStorage.token}&page=${params.page}&per_page=${params.per_page}`)
    const { result, total_count } = res.data
    setArticleData({
      list: result,
      count: total_count,
    })
    // 3 取消勾选的按钮
    setModifyDisabled(true)
    setDeleteDisabled(true)
  }
  // 点击删除
  const clickDelete = () => {
    // 弹框 确认删除
    confirm({
      title: '确定删除所选内容吗？',
      icon: <ExclamationCircleOutlined />,
      content: '内容删除后，不可恢复。',
      okText:'确定',
      cancelText:'取消',

      onOk() {
        delArticle({aids: deleteAid.join()}) // join（）函数会将数组拼接成字符串，以“,”作为间隔符
      },
  
      onCancel() { // 点击取消无需触发任何事件
      },
    })
  }

  return (
      <Card className='articleTableWrapper' title={'文章 ' + articleData.count}>
        <Space>
          <Button type='primary' onClick={publishArticle}>发布文章</Button>
          <Button type='dashed' disabled={modifyDisabled} onClick={clickModify}>修改</Button>
          <Button type='dashed' disabled={deleteDisabled} onClick={clickDelete}>删除</Button>
        </Space>
        <Divider />
        <Table
          rowKey={row => row.aid}
          rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          }}
          columns={columns}
          dataSource={articleData.list}
          pagination={{
            pageSize: params.per_page,
            total: articleData.count,
            onChange: pageChange,
          }}
        />
      </Card>
  )
}

export default Published