package service

import (
	"errors"
	"time"

	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
	"github.com/iberis9611/go-blog-application/pkg/common/constant"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
)

// 获取消息
func GetMessages(messageType int32, uuid string, friendNickname string) ([]response.MessageResponse, error) {
	db := pool.GetDB()

	if messageType == constant.MESSAGE_TYPE_USER {
		var queryUser *model.User
		db.First(&queryUser, "uuid = ?", uuid)
		if queryUser.Id == 0 {
			return nil, errors.New("用户不存在")
		}

		var friend *model.User
		db.First(&friend, "nickname = ?", friendNickname)
		if friend.Id == 0 {
			return nil, errors.New("用户不存在")
		}

		var messages []response.MessageResponse

		db.Raw(`SELECT m.id, m.from, m.to, m.content, m.content_type, m.create_at,
			u.nickname from_nickname, t.nickname to_nickname, u.avatar
			FROM messages m 
			LEFT JOIN users u ON m.from = u.uuid
			LEFT JOIN users t ON m.to = t.uuid
			WHERE m.from IN (?, ?) AND m.to IN (?, ?)`,
			uuid, friend.Uuid, uuid, friend.Uuid).Scan(&messages)

		return messages, nil
	}

	return nil, errors.New("unsupported query")
}

// 保存消息
func SaveMessage(message model.Message) {
	db := pool.GetDB()

	var fromUser model.User
	db.Find(&fromUser, "uuid = ?", message.From)
	if fromUser.Id == 0 {
		return
	}

	// DM
	if message.MessageType == constant.MESSAGE_TYPE_USER {
		var toUser model.User
		db.Find(&toUser, "uuid = ?", message.To)
		if toUser.Id == 0 {
			return
		}
	}

	saveMessage := &model.Message{
		From:        message.From,
		To:          message.To,
		Content:     message.Content,
		ContentType: int16(message.ContentType),
		MessageType: int16(message.MessageType),
		Url:         message.Url,
		CreateAt:    time.Now(),
	}

	db.Save(&saveMessage)
}
