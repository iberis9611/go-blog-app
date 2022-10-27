package model

import "time"

// 消息表
type Message struct {
	// 消息的唯一标识_id
	Id uint32 `json:"id" gorm:"primaryKey; autoIncrement; comment:'消息id'"`
	// 发送者uuid
	From string `json:"from" gorm:"type:varchar(150);not null;uniqueIndex:idx_message_from;comment:'发送者uuid'" binding:"required"`
	// 接收者uuid
	To string `json:"to" gorm:"type:varchar(150);not null;uniqueIndex:idx_message_to;comment:'接收者uuid'" binding:"required"`
	// 缩略图
	Thumbnail string `json:"thumbnail"`
	Url       string `json:"url"`
	// 创建时间
	CreateAt time.Time `json:"create_at"`
	// 更新时间
	UpdateAt *time.Time `json:"update_at"`
	// 消息内容
	Content string `json:"content" gorm:"type:varchar(2500);comment:'消息内容'" binding:"required"`
	// 读取状态 0 未读 1 已读
	// Read int16 `json:"read"`
	// 消息状态 0 删除 1 正常 2 撤回
	// Status int16 `json:"status"`
	// 消息类型：1单聊，2群聊
	MessageType int16 `json:"message_type" gorm:"type:SMALLINT;default:null;comment:'消息类型:1单聊,2群聊'" binding:"required"`
	// 消息内容类型 1 文字 2 普通文件 3 图片 4 音频 5 视频 6 语音聊天 7 视频聊天
	ContentType int16 `json:"content_type" gorm:"type:SMALLINT;default:null;comment:'消息内容类型'" binding:"required"`
}
