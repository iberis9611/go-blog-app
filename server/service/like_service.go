package service

import (
	"errors"
	"strings"
	"time"

	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
)

// GetLikeStatus 获取点赞状态
// aid：文章aid uuid：用户uid
func GetLikeStatus(aid string, uuid string) (int8, error) {
	// 1 连数据库
	db := pool.GetDB()

	// 2 判断文章是否存在，不存在则返回error
	var queryArticle *model.Article
	db.First(&queryArticle, "aid = ?", aid)
	if queryArticle.Id == 0 {
		return 100, errors.New("文章不存在")
	}

	// 3 文章存在 判断item_id=aid,user_id=uid的记录是否存在
	var queryLike *model.Like
	db.First(&queryLike, "item_id = ? AND user_uuid = ?", aid, uuid)

	// a 记录不存在 返回未关注
	if queryLike.Id == 0 {
		return 0, nil
	}

	// b 记录存在 返回其状态
	return queryLike.Status, nil
}

// Like 点赞
func Like(item_id string, uuid string) error {
	// 1 连接数据库
	db := pool.GetDB()

	// 2 根据item_id的前缀 判断item是文章还是评论
	prefix := strings.Split(item_id, "-")

	// 文章
	if prefix[0] == "art" {

		// i 判断文章是否存在
		var article *model.Article
		db.First(&article, "aid = ?", item_id)

		// 文章不存在则返回error
		if article.Id == 0 {
			return errors.New("文章不存在")
		}

		// ii 存在 -> 获得like, user, author对象
		var like *model.Like
		db.First(&like, "item_id = ? AND user_uuid = ?", item_id, uuid)
		var author, user *model.User
		db.First(&user, "uuid = ?", uuid)
		db.First(&author, "uuid = ?", article.UserUuid)

		// iii 判断item_id = aid,user_id = uid的记录是否存在
		// a 记录不存在
		if like.Id == 0 {
			// i likes: 创建新纪录
			like.ItemId = item_id
			like.UserUuid = uuid
			like.AuthorUuid = author.Uuid
			like.Status = 1
			like.LikedAt = time.Now()
			db.Create(&like)
			// ii article: like_count + 1
			db.Model(&article).Update("like_count", article.LikeCount+1)
			// iii author: like_received + 1
			db.Model(&author).Update("like_received", author.LikeReceived+1)
			// iv user: article_liked + 1
			db.Model(&user).Update("article_liked", user.ArticleLiked+1)
			return nil
		}

		// b 记录存在
		if like.Status == 0 {
			// likes: status改为1，update时间
			db.Model(&like).Updates(map[string]interface{}{"status": 1, "liked_at": time.Now()})
			db.Model(&article).Update("like_count", article.LikeCount+1)
			db.Model(&author).Update("like_received", author.LikeReceived+1)
			db.Model(&user).Update("article_liked", user.ArticleLiked+1)
			return nil
		}

		if like.Status == -1 {
			db.Model(&like).Updates(map[string]interface{}{"status": 1, "liked_at": time.Now()})
			db.Model(&article).Updates(map[string]interface{}{"like_count": article.LikeCount + 1, "dislike_count": article.DislikeCount - 1})
			db.Model(&author).Update("like_received", author.LikeReceived+1)
			db.Model(&user).Update("article_liked", user.ArticleLiked+1)
			return nil
		}

		if like.Status == 1 {
			db.Model(&like).Update("status", 0)
			db.Model(&article).Update("like_count", article.LikeCount-1)
			db.Model(&author).Update("like_received", author.LikeReceived-1)
			db.Model(&user).Update("article_liked", user.ArticleLiked-1)
			return nil
		}

		return errors.New("like_status值有误")
	}

	// 评论
	if prefix[0] == "com" {

		// i 判断评论是否存在
		var comment *model.Comment
		db.First(&comment, "cid = ?", item_id)

		if comment.Id == 0 {
			return errors.New("评论不存在")
		}
		if comment.DeleteAt == 1 {
			return errors.New("评论已删除")
		}

		// ii 评论存在且未被删除 -> 判断对于该评论的点赞记录是否存在
		var like *model.Like
		db.First(&like, "item_id = ? AND user_uuid = ?", item_id, uuid)

		// a 记录不存在
		if like.Id == 0 {
			like.ItemId = item_id
			like.UserUuid = uuid
			like.AuthorUuid = comment.SentFrom
			like.LikedAt = time.Now()
			like.Status = 1
			// likes：创建记录
			db.Create(&like)
			// comments：like_count+1
			db.Model(&comment).Update("like_count", comment.LikeCount+1)
			return nil
		}

		// b 记录存在
		if like.Status == 0 {
			db.Model(&like).Update("status", 1)
			db.Model(&comment).Update("like_count", comment.LikeCount+1)
			return nil
		}
		if like.Status == 1 {
			db.Model(&like).Update("status", 0)
			db.Model(&comment).Update("like_count", comment.LikeCount-1)
			return nil
		}
		if like.Status == -1 {
			db.Model(&like).Update("status", 1)
			db.Model(&comment).Updates(map[string]interface{}{"like_count": comment.LikeCount + 1, "dislike_count": comment.DislikeCount - 1})
			return nil
		}
		return errors.New("like_status错误")
	}

	return errors.New("item_id错误")
}

// Dislike 点踩
func Dislike(item_id string, uuid string) error {
	// 1 连接数据库
	db := pool.GetDB()

	// 2 根据item_id的前缀 判断item是文章还是评论
	prefix := strings.Split(item_id, "-")

	// 文章
	if prefix[0] == "art" {

		// i 判断文章是否存在，不存在则返回error
		var article *model.Article
		db.First(&article, "aid = ?", item_id)
		if article.Id == 0 {
			return errors.New("文章不存在")
		}

		// ii 获得like, user, author对象
		var like *model.Like
		db.First(&like, "item_id = ? AND user_uuid = ?", item_id, uuid)
		var author, user *model.User
		db.First(&user, "uuid = ?", uuid)
		db.First(&author, "uuid = ?", article.UserUuid)

		// iii 判断item_id=aid,user_id=uid的row是否存在
		// a 记录不存在
		if like.Id == 0 {
			// i likes: 创建新纪录
			like.ItemId = item_id
			like.UserUuid = uuid
			like.AuthorUuid = author.Uuid
			like.LikedAt = time.Now()
			like.Status = -1
			db.Create(&like)
			// ii articles: dislike_count + 1
			db.Model(&article).Update("dislike_count", article.DislikeCount+1)
			return nil
		}

		// b 记录存在
		if like.Status == 0 {
			db.Model(&like).Update("status", -1)
			db.Model(&article).Update("dislike_count", article.DislikeCount+1)
			return nil
		}

		if like.Status == -1 {
			db.Model(&like).Update("status", 0)
			db.Model(&article).Update("dislike_count", article.DislikeCount-1)
			return nil
		}

		if like.Status == 1 {
			db.Model(&like).Update("status", -1)
			db.Model(&article).Updates(map[string]interface{}{"like_count": article.LikeCount - 1, "dislike_count": article.DislikeCount + 1})
			db.Model(&author).Update("like_received", author.LikeReceived-1)
			db.Model(&user).Update("article_liked", user.ArticleLiked-1)
			return nil
		}

		return errors.New("like_status值有误")
	}

	// 评论
	if prefix[0] == "com" {

		// i 判断评论是否存在
		var comment *model.Comment
		db.First(&comment, "cid = ?", item_id)

		if comment.Id == 0 {
			return errors.New("评论不存在")
		}
		if comment.DeleteAt == 1 {
			return errors.New("评论已删除")
		}

		// ii 评论存在且未被删除 -> 判断对于该评论的点赞记录是否存在
		var like *model.Like
		db.First(&like, "item_id = ? AND user_uuid = ?", item_id, uuid)

		// a 记录不存在
		if like.Id == 0 {
			like.ItemId = item_id
			like.UserUuid = uuid
			like.AuthorUuid = comment.SentFrom
			like.LikedAt = time.Now()
			like.Status = -1
			// 创建记录
			db.Create(&like)
			// comment表：dislike+1
			db.Model(&comment).Update("dislike_count", comment.DislikeCount+1)
			return nil
		}

		// b 记录存在
		if like.Status == 0 {
			db.Model(&like).Update("status", -1)
			db.Model(&comment).Update("dislike_count", comment.DislikeCount+1)
			return nil
		}
		if like.Status == -1 {
			db.Model(&like).Update("status", 0)
			db.Model(&comment).Update("dislike_count", comment.DislikeCount-1)
			return nil
		}
		if like.Status == 1 {
			db.Model(&like).Update("status", -1)
			db.Model(&comment).Updates(map[string]interface{}{"like_count": comment.LikeCount - 1, "dislike_count": comment.DislikeCount + 1})
			return nil
		}

		return errors.New("like_status错误")
	}

	return errors.New("item_id错误")
}
