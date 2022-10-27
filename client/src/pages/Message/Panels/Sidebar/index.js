import ChatList from "./Components/ChatList"
import SearchFriend from "./Components/SearchFriend"
import { useState } from 'react'

function Sidebar({viewMessage, setViewMessage, chatList, userUuid, setMessageList, setChooseUser, getChooseUser, messageList, getSonMsg, getMessageList }) {
    const [showSearchPanel, setShowSearchPanel] = useState(false)

    return (
        <>
            <ChatList 
                showSearchPanel={showSearchPanel} 
                setShowSearchPanel={setShowSearchPanel} 
                viewMessage={viewMessage} 
                setViewMessage={setViewMessage}
                chatList={chatList}
                userUuid={userUuid}  
                setMessageList={setMessageList}
                setChooseUser={setChooseUser}
                getChooseUser={getChooseUser}
                messageList={messageList}
                getSonMsg={getSonMsg}
                getMessageList={getMessageList}
            />
            <SearchFriend 
                showSearchPanel={showSearchPanel} 
                setShowSearchPanel={setShowSearchPanel} 
            />
        </>
    )
}

export default Sidebar