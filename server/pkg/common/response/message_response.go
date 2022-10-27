package response

import "time"

// modification needed
type MessageResponse struct {
	Id           int32     `json:"id" gorm:"primarykey"`
	From         string    `json:"from" gorm:"index"`
	To           string    `json:"to" gorm:"index"`
	Content      string    `json:"content" gorm:"type:varchar(2500)"`
	ContentType  int16     `json:"content_type" gorm:"comment:'消息内容类型：1文字，2语音，3视频'"`
	CreateAt     time.Time `json:"create_at"`
	FromNickname string    `json:"from_nickname"`
	ToNickname   string    `json:"to_nickname"`
	Avatar       string    `json:"avatar"`
	Url          string    `json:"url"`
}
