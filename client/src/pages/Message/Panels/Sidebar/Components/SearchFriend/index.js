import { Card, Button, Input, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Search } = Input
const { Title } = Typography


function SearchFriend({showSearchPanel, setShowSearchPanel}) {
    const onSearch = (value) => console.log(value)
    
    return (
        <Card className='searchPanel' style={!showSearchPanel ? {display:'none'} : {}}
                >
                    <Card className='searchHeader'>
                        <Title level={5}>发起私聊</Title>
                        <Button type='text' size='small' onClick={()=>setShowSearchPanel(false)}>取消</Button>
                    </Card>
                    <Search
                        className='searchField'
                        prefix={<SearchOutlined />}
                        placeholder= '搜索'
                        allowClear
                        onSearch={onSearch}
                        style={{
                            width: '100%',
                        }}
                    />
                    <Card className='searchBody' style={{paddingTop:'10px'}}>
                        test
                    </Card>
                </Card>
    )
}

export default SearchFriend