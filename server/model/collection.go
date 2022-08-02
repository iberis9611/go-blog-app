package model

import "time"

type Collection struct {
	// 收藏表id
	Id int32 `json:"id" gorm:"primaryKey; autoIncrement; comment:'收藏表id'"`
	// 用户id
	UserUuid string `json:"user_uuid" gorm:"not null;comment:'用户uuid'"`
	// 文章aid
	ArticleAid string `json:"article_aid" gorm:"type:varchar(150);not null;comment:'文章aid'"`
	// 收藏状态 1：收藏 0：未收藏
	Status int8 `json:"status" gorm:"not null;comment:'收藏状态'"`
	// 点赞的事件
	SavedAt time.Time `json:"saved_at" gorm:"comment:'收藏时间'"`
}
