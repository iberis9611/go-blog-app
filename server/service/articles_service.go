package service

import (
	"errors"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
)

// 查询文章列表
// searchType是指搜索的类型，包括all（所有文章），published（用户发布的文章），liked（用户点赞的文章），saved（用户收藏的文章）
func GetArticles(searchType string, uuid string, page int, perPage int) (model.ArticlePaginated, error) {
	db := pool.GetDB()

	pageNum := perPage * (page - 1)             // 当前页的第一篇文章，起始索引为0
	articleList := []*model.ArticleWithAvatar{} // 文章列表
	var total *int                              // 文章总数

	// 1 查询所有文章
	if searchType == "all" {
		db.Raw(`SELECT a.id, a.aid, a.user_uuid, a.title, a.content, a.cover, a.view_count, a.like_count,
			a.save_count, a.comment_count, u.avatar, u.nickname author
			FROM articles a
			LEFT OUTER JOIN users u ON u.uuid = a.user_uuid
			WHERE a.delete_at = 0
			LIMIT ?, ?`, pageNum, perPage).Scan(&articleList)
		db.Raw(`SELECT COUNT(*) FROM articles WHERE delete_at=0`).Scan(&total)

		return model.ArticlePaginated{
			Result:     articleList,
			TotalCount: *total,
		}, nil
	}

	// 2 查询某用户发表过的文章
	if searchType == "published" {
		db.Raw(`SELECT a.id, a.aid, a.user_uuid, a.title, a.content, a.cover, a.view_count, a.like_count,
			a.save_count, a.comment_count, u.avatar, u.nickname author
			FROM articles a
			LEFT OUTER JOIN users u ON u.uuid = a.user_uuid
			WHERE a.user_uuid = ? AND a.delete_at = 0
			LIMIT ?, ?`, uuid, pageNum, perPage).Scan(&articleList)
		db.Raw(`SELECT COUNT(*) FROM articles WHERE user_uuid = ? AND delete_at = 0`, uuid).Scan(&total)

		return model.ArticlePaginated{
			Result:     articleList,
			TotalCount: *total,
		}, nil
	}

	// 3 查询用户点赞的文章
	if searchType == "liked" {
		db.Raw(`SELECT a.id, a.aid, a.user_uuid, a.title, a.content, a.cover, a.view_count, a.like_count,
			a.save_count, a.comment_count, u.avatar, u.nickname author
			FROM articles a
			LEFT OUTER JOIN likes l ON l.item_id = a.aid
			LEFT OUTER JOIN users u ON u.uuid = a.user_uuid
			WHERE l.user_uuid = ? AND l.status = 1 AND a.delete_at = 0`, uuid).Scan(&articleList)
		db.Raw(`SELECT COUNT(*)
			FROM articles a
			LEFT OUTER JOIN likes l ON l.item_id = a.aid
			WHERE l.user_uuid = ? AND l.status = 1 AND a.delete_at = 0`, uuid).Scan(&total)

		return model.ArticlePaginated{
			Result:     articleList,
			TotalCount: *total,
		}, nil
	}

	// 4 查询用户收藏的文章
	if searchType == "saved" {
		db.Raw(`SELECT a.id, a.aid, a.user_uuid, a.title, a.content, a.cover, a.view_count, a.like_count,
			a.save_count, a.comment_count, u.avatar, u.nickname author
			FROM articles a
			LEFT OUTER JOIN collections s ON s.article_aid = a.aid
			LEFT OUTER JOIN users u ON u.uuid = a.user_uuid
			WHERE s.user_uuid = ? AND s.status = 1 AND a.delete_at = 0`, uuid).Scan(&articleList)
		db.Raw(`SELECT COUNT(*)
			FROM articles a
			LEFT OUTER JOIN collections s ON s.article_aid = a.aid
			WHERE s.user_uuid = ? AND s.status = 1 AND a.delete_at = 0`, uuid).Scan(&total)

		return model.ArticlePaginated{
			Result:     articleList,
			TotalCount: *total,
		}, nil
	}

	return model.ArticlePaginated{}, errors.New("查询类型不存在")
}

// 发布文章
func PublishArticle(art *model.Article, user_uuid string) error {

	db := pool.GetDB()

	var user model.User
	db.First(&user, "uuid = ?", user_uuid)

	// 判断文章标题是否已经存在，若存在，则创建失败
	var queryArticle model.Article
	db.First(&queryArticle, "title = ?", art.Title)
	if queryArticle.Id != 0 {
		return errors.New("标题已存在")
	}

	// 标题不存在 -> 新建文章
	// aid格式：'10000001'
	art.Aid = "art-" + uuid.New().String()
	art.UserUuid = user_uuid
	art.CreateAt = time.Now()

	db.Create(&art)                                                      // 创建文章
	db.Model(&user).Update("article_published", user.ArticlePublished+1) // 用户表文章数+1

	return nil
}

// 修改文章
func ModifyArticle(aid string, article *model.Article) error {

	db := pool.GetDB()

	var original_article, third_article *model.Article
	db.First(&original_article, "aid = ?", aid)
	db.First(&third_article, "title = ?", article.Title)

	// 如果新的title和原先的不同
	if article.Title != original_article.Title {
		// 判断新title是否已存在，存在则报错
		if third_article.Id != 0 && third_article.DeleteAt == 0 {
			return errors.New("标题已存在")
		}
		// 不存在，更新title, cover and content
		db.Model(&original_article).Updates(map[string]interface{}{"title": article.Title, "content": article.Content, "cover": article.Cover})
		return nil
	}

	// 新旧title一致，更新cover and content
	db.Model(&original_article).Updates(map[string]interface{}{"content": article.Content, "cover": article.Cover})
	return nil
}

// 删除文章
func DeleteArticle(aids string, uuid string) error {
	db := pool.GetDB()

	// 将数组转化为切片
	s := strings.Split(aids, ",")

	var user *model.User
	db.First(&user, "uuid = ?", uuid)
	if user.Id == 0 || user.DeleteAt == 1 {
		return errors.New("用户不存在")
	}

	// 单删
	if len(s) == 1 {
		var article *model.Article
		db.First(&article, "aid = ?", s[0])
		if article.Id == 0 || article.DeleteAt == 1 {
			return errors.New("文章不存在")
		}

		db.Model(&article).Update("delete_at", 1)                            // 文章删除状态置为1
		db.Model(&user).Update("article_published", user.ArticlePublished-1) // 用户表文章数-1

		return nil
	}

	// 批量删除
	for _, v := range s {
		var article *model.Article
		db.First(&article, "aid = ?", v)
		if article.Id == 0 || article.DeleteAt == 1 {
			return errors.New("文章不存在")
		}
	}

	db.Table("articles").Where("aid IN ?", s).Update("delete_at", 1)
	db.Model(&user).Update("article_published", user.ArticlePublished-uint16(len(s)))

	return nil
}

// 根据aid查询某一文章（包括收藏点赞的状态）
func GetArticleByAid(aid string, uuid string) (*model.ArticleWithAtitude, error) {
	db := pool.GetDB()

	log.Println(aid, uuid)
	article := &model.ArticleWithAtitude{}
	db.Raw(`SELECT a.id, a.aid, a.user_uuid, a.status, a.view_count, a.like_count, a.dislike_count,
		a.comment_count, a.save_count, a.create_at, a.update_at, a.delete_at, a.title, a.cover, a.content, 
		u.nickname, u.avatar, u.intro, u.article_published, u.follower, u.like_received,
		l.status like_status, s.status save_status, f.status follow_status
		FROM articles a
		LEFT OUTER JOIN users u ON u.uuid = a.user_uuid
		LEFT OUTER JOIN likes l ON l.item_id = a.aid AND l.user_uuid = ?
		LEFT OUTER JOIN collections s ON s.article_aid = a.aid AND s.user_uuid = ?
		LEFT OUTER JOIN friends f ON f.following_uuid = a.user_uuid AND f.user_uuid = ?
		WHERE a.aid = ?`, uuid, uuid, uuid, aid).Scan(&article)
	if article.Id == 0 || article.DeleteAt == 1 {
		return nil, errors.New("文章不存在")
	}

	return article, nil
}

// 通过aid查询文章
func GetArticleByAidSimple(aid string) (*model.Article, error) {
	db := pool.GetDB()
	var queryArticle *model.Article
	db.Select("id", "aid", "title", "cover", "content").First(&queryArticle, "aid = ? AND delete_at = 0", aid)
	if queryArticle.Id == 0 {
		return nil, errors.New("文章不存在")
	}

	return queryArticle, nil
}
