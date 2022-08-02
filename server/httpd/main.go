package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/httpd/handler"
	"github.com/iberis9611/go-blog-application/httpd/router"
)

func main() {

	r := gin.Default()

	r.Use(router.Cors()) // 注册中间件

	group := r.Group("") // {}是为了代码规范
	{
		// 用户
		group.POST("/user/login", handler.Login())
		group.GET("/user/validateUsername", handler.ValidateUsername)
		group.GET("/user/validateNickname", handler.ValidateNickname)
		group.POST("/user/register", handler.Register)
		group.POST("/user/modifyProfile", handler.ModifyUserProfile)
		group.GET("/user/profile", handler.GetUserProfileInfo)
		group.GET("/user/namecard", handler.GetUserNameCard)
		group.GET("/user/people/:uuid", handler.GetNameCardByUuid)

		// 文件
		group.POST("/file/upload", handler.SaveFile)
		group.GET("/file/:fileName", handler.GetFile)

		// 关注
		group.GET("/user/followStatus", handler.FollowStatus)
		group.POST("/user/clickFollow", handler.ClickFollow)

		// 文章
		group.GET("/articles", handler.GetArticleList)
		group.GET("/article/:aid", handler.GetArticleByAid)
		group.GET("/articleSimple/:aid", handler.GetArticleSimple)
		group.GET("/articlePublished", handler.GetArticlesPublishedByOne)
		group.GET("/articleLiked", handler.GetArticlesLikedByOne)
		group.GET("/articleSaved", handler.GetArticlesSavedByOne)
		group.POST("/publish", handler.PublishArticle)
		group.POST("/deleteArticle", handler.DeleteArticle)

		// 评论
		group.GET("/comments", handler.GetCommentList)
		group.POST("/comments/add", handler.AddComment)
		group.POST("/comments/del", handler.RemoveComment)

		// 收藏
		group.GET("/article/savedStatus", handler.GetSavedStatus)
		group.POST("/article/clickSave", handler.ClickSave)

		// 点赞
		group.GET("/like/status", handler.GetLikeStatus)
		group.POST("/like/thumbUp", handler.ClickLike)
		group.POST("/like/thumbDown", handler.ClickDislike)
	}

	s := &http.Server{
		Addr:           ":8000",
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	s.ListenAndServe()
}
