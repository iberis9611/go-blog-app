package model

import "time"

type Comment struct {
	Id             int32  `json:"id" gorm:"primaryKey; autoIncrement; comment:'评论id'"`
	Cid            string `json:"cid" gorm:"type:varchar(150);not null;uniqueIndex:idx_article_aid;comment:'评论的item_id'"`
	SentFrom       string `json:"sent_from" gorm:"not null; comment:'评论发布者uuid'"`
	SentTo         string `json:"sent_to" gorm:"not null; comment:'评论接收者uuid'"`
	ArticleAid     string `json:"article_aid" gorm:"not null; comment:'被评论的文章aid'"`
	CommentContent string `json:"comment_content" gorm:"type:varchar(1000);not null;comment:'评论内容'"`
	LikeCount      uint16 `json:"like_count" gorm:"type:SMALLINT UNSIGNED;default:0;not null;comment:'点赞量'"`
	DislikeCount   uint16 `json:"dislike_count" gorm:"type:SMALLINT UNSIGNED;default:0;not null;comment:'点踩量'"`
	// 评论状态 1表示正常 2表示不显示
	Status   int8      `json:"status" gorm:"type:TINYINT;not null;comment:'评论状态'"`
	CreateAt time.Time `json:"create_at" gorm:"comment:'评论发布时间'"`
	// 移除评论时间 0表示未删除；1表示已删除
	DeleteAt int64 `json:"delete_at" gorm:"type:BIGINT;default:0;not null;comment:'删除状态'"`
}

type CommentWithLikes struct {
	Comment
	Avatar   string `json:"avatar"`
	Nickname string `json:"nickname"`
	// 当前用户对该评论的点赞/踩的状态
	Attitude int8 `json:"attitude"`
}
