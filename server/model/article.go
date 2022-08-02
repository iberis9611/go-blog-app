package model

import (
	"time"

	"gorm.io/gorm"
)

// ArticleInfo 文章表
type Article struct {
	Id       int32  `json:"id" gorm:"primaryKey; autoIncrement; comment:'文章id'"`
	Aid      string `json:"aid" gorm:"char(8);not null;uniqueIndex:idx_article_aid;comment:'文章id'"`
	UserUuid string `json:"user_uuid" gorm:"type:varchar(150);not null; comment:'用户uuid'"`
	// Status表示文章的状态。1代表草稿，2代表已发布
	Status       uint8      `json:"status" gorm:"type:TINYINT UNSIGNED; not null; comment:'文章状态"`
	ViewCount    uint64     `json:"view_count" gorm:"type:BIGINT UNSIGNED; not null; comment:'阅读量'"`
	LikeCount    uint32     `json:"like_count" gorm:"type:INT UNSIGNED; not null; comment:'点赞量'"`
	DislikeCount uint32     `json:"dislike_count" gorm:"type:INT UNSIGNED; not null; comment:'点踩量'"`
	CommentCount uint16     `json:"comment_count" gorm:"type:SMALLINT UNSIGNED; not null; comment:'评论量'"`
	SaveCount    uint16     `json:"save_count" gorm:"type:SMALLINT UNSIGNED; not null; comment:'收藏量'"`
	CreateAt     time.Time  `json:"create_at"`
	UpdateAt     *time.Time `json:"update_at"`
	DeleteAt     int64      `json:"delete_at"`
	// 作者可修改信息
	Title   string `json:"title" gorm:"type:varchar(100); not null; comment:'文章标题'"`
	Cover   string `json:"cover" gorm:"type:varchar(260); not null; comment:'文章封面'"`
	Content string `json:"content" gorm:"type:longtext; not null; comment:'内容'"`
}

type ArticleWithAtitude struct {
	Article
	LikeStatus int8 `json:"like_status"`
	SaveStatus int8 `json:"save_status"`
}

type ArticleWithAvatar struct {
	Article
	Avatar string `json:"avatar"`
	Author string `json:"author"`
}

func (a *Article) BeforeUpdate(tx *gorm.DB) error {
	tx.Statement.SetColumn("UpdateAt", time.Now())
	return nil
}
