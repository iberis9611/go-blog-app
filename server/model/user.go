package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	Id               int32      `json:"id" gorm:"primaryKey; autoIncrement; comment:'id'"`
	Uuid             string     `json:"token" gorm:"type:varchar(150);not null;uniqueIndex:idx_user_uuid;comment:'uuid'"`
	ArticlePublished uint16     `json:"article_published" gorm:"type:SMALLINT UNSIGNED;default:0;not null;comment:'发布的文章'"`
	LikeReceived     uint32     `json:"like_received" gorm:"type:INT UNSIGNED;default:0;not null;comment:'获赞'"`
	ArticleLiked     uint16     `json:"article_liked" gorm:"type:SMALLINT UNSIGNED;default:0;not null;comment:'点赞的文章'"`
	ArticleSaved     uint16     `json:"article_saved" gorm:"type:SMALLINT UNSIGNED;default:0;not null;comment:'收藏的文章'"`
	Following        uint32     `json:"following" gorm:"type:INT UNSIGNED;default:0;not null;comment:'关注的人'"`
	Follower         uint32     `json:"follower" gorm:"type:INT UNSIGNED;default:0;not null;comment:'粉丝'"`
	CreateAt         time.Time  `json:"create_at"`
	UpdateAt         *time.Time `json:"update_at"`
	DeleteAt         int64      `json:"deleteAt"`

	Username string     `json:"username" form:"username" binding:"required" gorm:"type:varchar(30);uniqueIndex:idx_user_username; not null; comment:'用户名'"`
	Password string     `json:"password" form:"password" binding:"required" gorm:"type:varchar(30);not null; comment:'密码'"`
	Nickname string     `json:"nickname" gorm:"type:varchar(30); not null; uniqueIndex:idx_user_nickname; comment:'昵称'"`
	Birthday *time.Time `json:"birthday" gorm:"comment:'生日'"`
	Address  string     `json:"address" gorm:"default:'';not null;comment:'住址'"`
	Intro    string     `json:"intro" gorm:"type:varchar(100);default:'';not null;comment:'个人简介'"`
	Email    string     `json:"email" gorm:"type:varchar(80);default:'';not null;column:email;comment:'邮箱'"`
	Phone    string     `json:"phone" gorm:"type:char(11);default:'';not null;comment:'电话'"`
	Avatar   string     `json:"avatar" gorm:"type:varchar(260);default:'';not null;comment:'头像'"`
	// m - male, f - female, o - other
	Gender string `json:"gender" gorm:"type:char(1); default:'o'; not null; comment:'性别'"`
}

type UserWithFollow struct {
	User
	FollowStatus int8 `json:"follow_status"`
}

func (u *User) BeforeUpdate(tx *gorm.DB) error {
	tx.Statement.SetColumn("UpdateAt", time.Now())
	return nil
}
