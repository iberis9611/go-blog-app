package request

type MessageRequest struct {
	MessageType    int32  `json:"message_type"`
	Uuid           string `json:"uuid"`
	FriendNickname string `json:"friend_nickname"`
}
