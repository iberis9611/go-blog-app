package model

import (
	"time"
)

type Chat struct {
	Id           int32     `json:"id" gorm:"primaryKey; autoIncrement; comment:'聊天id'"`
	UserUuid     string    `json:"user_uuid" gorm:"type:varchar(150);not null;uniqueIndex:idx_chat_uuid;comment:'用户uuid'"`
	ToUuid       string    `json:"to_uuid" gorm:"type:varchar(150);not null; comment:'to_uuid'"`
	ChatNickname string    `json:"chat_nickname" gorm:"type:varchar(30); not null; uniqueIndex:idx_chat_nickname; comment:'对方昵称'"`
	ChatAvatar   string    `json:"chat_avatar" gorm:"type:varchar(260);default:'';not null;comment:'对方头像'"`
	UpdateAt     time.Time `json:"update_at"`
	Message      string    `json:"message" gorm:"type:varchar(100); default null; comment:'最新消息'"`
	MessageType  int16     `json:"message_type"`
}
