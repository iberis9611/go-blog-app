package service

import (
	"errors"
	"time"

	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
)

// 获取聊天列表
func GetChatList(token string) ([]*model.Chat, error) {
	db := pool.GetDB()

	var user *model.User
	db.First(&user, "uuid = ?", token)
	if user.Id == 0 {
		return nil, errors.New("用户不存在")
	}

	chatList := []*model.Chat{}
	// SELECT * FROM chatList WHERE user_uuid = token ORDER BY update_at desc, chat_nickname
	db.Where("user_uuid = ?", token).Order("update_at desc, chat_nickname").Find(&chatList)

	return chatList, nil
}

// 新增聊天
func AddChat(chat *model.Chat) error {
	db := pool.GetDB()

	user_uuid := chat.UserUuid
	chat_nickname := chat.ChatNickname
	var user *model.User
	db.First(&user, "uuid = ?", user_uuid)
	if user.Id == 0 {
		return errors.New("用户不存在")
	}

	var friend *model.User
	db.First(&friend, "nickname = ?", chat_nickname)
	if friend.Id == 0 {
		return errors.New("对方用户不存在")
	}

	var queryChat *model.Chat
	db.First(&queryChat, "user_uuid = ? AND chat_nickname = ?", user_uuid, chat_nickname)

	if queryChat.Id == 0 {
		chat.UpdateAt = time.Now()
		db.Create(&chat)
	}

	return nil
}

// 更新聊天
func UpdateChat() {}

// 移除聊天
func RemoveChat() {

}
