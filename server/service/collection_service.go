package service

import (
	"errors"
	"time"

	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
)

// GetSavedStatus 获取收藏状态status，
// 值为-1表示发生错误，值为0表示未收藏，1表示已收藏。
// aid：文章id uuid：用户uuid
func GetSavedStatus(aid string, uuid string) (int8, error) {
	// 1 连接数据库
	db := pool.GetDB()

	// 2 判断被收藏文章是否存在，不存在则返回error
	var queryArticle *model.Article
	db.First(&queryArticle, "aid = ?", aid)
	if queryArticle.Id == 0 {
		return -1, errors.New("文章不存在")
	}

	// 3 返回收藏状态
	// 如果用户未登录
	if uuid == "" {
		return 0, nil
	}
	var querySaved *model.Collection
	db.First(&querySaved, "article_aid = ? and user_uuid = ?", aid, uuid)
	// 如果记录不存在，表示未收藏，status返回0
	if querySaved.Id == 0 {
		return 0, nil
	}

	// 否则，表示记录存在，返回记录中对应的值
	return querySaved.Status, nil
}

// Save 点击收藏
// aid：文章aid uuid：用户uuid
func Save(aid string, uuid string) error {
	// 1 连接数据库
	db := pool.GetDB()

	// 2 判断被收藏文章是否存在，不存在则返回error
	var queryArticle *model.Article
	db.First(&queryArticle, "aid = ?", aid)
	if queryArticle.Id == 0 {
		return errors.New("文章不存在")
	}

	// 3 判断记录是否存在
	var querySaved *model.Collection
	db.First(&querySaved, "article_aid = ? and user_uuid = ?", aid, uuid)
	var user *model.User
	db.First(&user, "uuid = ?", uuid)
	// 如果记录不存在
	if querySaved.Id == 0 {
		querySaved.Status = 1
		querySaved.ArticleAid = aid
		querySaved.UserUuid = uuid
		querySaved.SavedAt = time.Now()
		// collections:插入记录
		db.Create(&querySaved)
		// users:article_saved + 1
		db.Model(&user).Update("article_saved", user.ArticleSaved+1)
		// articles: save_count + 1
		db.Model(&queryArticle).Update("save_count", queryArticle.SaveCount+1)
		return nil
	}
	// 记录存在，未收藏
	if querySaved.Status == 0 {
		db.Model(&querySaved).Updates(map[string]interface{}{"status": 1, "saved_at": time.Now()})
		db.Model(&user).Update("article_saved", user.ArticleSaved+1)
		db.Model(&queryArticle).Update("save_count", queryArticle.SaveCount+1)
		return nil
	}
	// 记录存在，已收藏
	if querySaved.Status == 1 {
		db.Model(&querySaved).Update("status", 0)
		db.Model(&user).Update("article_saved", user.ArticleSaved-1)
		db.Model(&queryArticle).Update("save_count", queryArticle.SaveCount-1)
		return nil
	}
	return errors.New("未知错误")
}
