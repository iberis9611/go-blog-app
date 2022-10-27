import { useStore } from "@/store"
import { Button, Card, Space, Typography } from "antd"
import { observer } from 'mobx-react-lite'

const { Text} = Typography
function Trending() {
    const {messageStore} = useStore()
    const incr = () => {
        messageStore.increment()
    }
    const decr = () => {
        messageStore.decrement()
    }

    return (
        <Card>
            <Space direction="vertical">
                <Text>{messageStore.count}</Text>
                <Button onClick={incr}>increment count</Button>
                <Button onClick={decr}>decrement count</Button>
            </Space>
        </Card>
    )
}

export default observer(Trending)