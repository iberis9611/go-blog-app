package model

import "time"

// Like 点赞表
type Like struct {
	// 点赞表id
	Id int32 `json:"id" gorm:"primaryKey; autoIncrement; comment:'id'"`
	// 用户uuid
	UserUuid string `json:"user_uuid" gorm:"type:varchar(150);not null;comment:'用户uuid'"`
	// 作者uuid
	AuthorUuid string `json:"author_uuid" gorm:"type:varchar(150);not null;comment:'作者uuid'"`
	// 对象aid/cid
	ItemId string `json:"item_id" gorm:"type:varchar(150);not null;comment:'文章aid或评论cid'"`
	// 点赞状态 1：点赞 -1：点踩 0：无
	Status int8 `json:"status" gorm:"type:TINYINT;default:0;not null;comment:'点赞状态'"`
	// 点赞时间
	LikedAt time.Time `json:"liked_at" gorm:"comment:'点赞时间'"`
}
