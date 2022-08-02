package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
)

// 获取某一文章全部评论
func GetAllCommentsByArticleId(article_aid string, user_uuid string) ([]*model.CommentWithLikes, error) {
	// 1 连数据库
	db := pool.GetDB()

	// 2 判断文章是否存在
	var queryArticle *model.Article
	db.First(&queryArticle, "aid = ?", article_aid)
	if queryArticle.DeleteAt == 1 {
		return nil, errors.New("文章不存在！")
	}

	// 3 文章存在 获取评论列表（左外连接查询）
	commentList := []*model.CommentWithLikes{}
	db.Raw(`SELECT c.id, c.cid, c.sent_from, c.sent_to, c.article_aid, c.comment_content,  c.comment_content, c.like_count,
		c.dislike_count, c.status, c.create_at, c.delete_at, u.avatar, u.nickname, l.status attitude
		FROM comments c
		LEFT OUTER JOIN likes l ON l.item_id = c.cid AND l.user_uuid = ?
		LEFT OUTER JOIN users u ON u.uuid = c.sent_from
		WHERE c.status = 1 AND c.delete_at = 0 AND c.article_aid = ?
		ORDER BY c.create_at DESC`, user_uuid, article_aid).Scan(&commentList)
	return commentList, nil
}

// 添加评论
func AddComment(comment *model.Comment) error {
	// 1 连数据库
	db := pool.GetDB()

	// 2 判断文章是否存在
	var queryArticle *model.Article
	db.First(&queryArticle, "aid = ?", comment.ArticleAid)
	if queryArticle.DeleteAt == 1 {
		return errors.New("文章不存在")
	}

	// 3 文章存在
	// 修改comment表 添加新评论 修改文章表 评论数+1
	comment.Cid = "com-" + uuid.New().String()
	comment.CreateAt = time.Now()
	comment.Status = 1
	db.Create(&comment)
	db.Model(&queryArticle).Update("comment_count", queryArticle.CommentCount+1)
	return nil
}

// 删除评论
func RemoveComment(comment_cid string) error {
	// 1 连接数据库
	db := pool.GetDB()

	// 2 判断comment是否可见，如果文章已删除，则comment不可见（status为2）
	var queryComment *model.Comment
	db.First(&queryComment, "cid = ?", comment_cid)
	if queryComment.Id == 0 { // comment不存在
		return errors.New("发生未知错误！")
	}
	if queryComment.Status == 2 {
		return errors.New("发生未知错误！")
	}

	// 3 comment可见（status状态为1）但已经被删除
	if queryComment.DeleteAt == 1 {
		return errors.New("评论不存在！")
	}

	// 4 comment还在 删除动作则是将delete_at从0变为1
	db.Model(&queryComment).Update("delete_at", 1)

	// 5将对应article的comment_count-1
	var article *model.Article
	db.First(&article, "aid = ?", queryComment.ArticleAid)
	db.Model(&article).Update("comment_count", article.CommentCount-1)

	return nil
}
