package model

import "time"

type Friend struct {
	Id            int32     `json:"id" gorm:"primaryKey;autoIncrement;comment:'id'"`
	UserUuid      string    `json:"user_uuid" gorm:"type:varchar(150);not null;comment:'用户uuid'"`
	FollowingUuid string    `json:"following_uuid" gorm:"type:varchar(150);not null;comment:'被关注者uuid'"`
	FollowAt      time.Time `json:"follow_at" gorm:"comment:'关注时间'"`
	// 关注状态：0 未关注 1 已关注
	Status int8 `json:"status" gorm:"type:TINYINT;not null;comment:'关注状态'"`
}
