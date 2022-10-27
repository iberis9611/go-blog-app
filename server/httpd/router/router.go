package router

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/httpd/handler"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/pkg/common/util"
)

func NewRouter() *gin.Engine {

	r := gin.Default()

	r.Use(Cors()) // register middleware

	group := r.Group("")
	// {}是为了代码规范
	{
		group.POST("/user/login", handler.Login)
		group.POST("/user/register", handler.Register)
		group.GET("/file/:fileName", handler.GetFile)
		group.GET("/ws", handler.RunSocekt)
	}

	authorized := r.Group("", AuthRequired())
	{
		// user
		authorized.GET("/user/validateUsername", handler.ValidateUsername)
		authorized.GET("/user/validateNickname", handler.ValidateNickname)
		authorized.POST("/user/modifyProfile", handler.ModifyUserProfile)
		authorized.GET("/user/profile", handler.GetUserProfileInfo)
		authorized.GET("/user/people/:uuid", handler.GetNameCardByUuid)

		// file
		authorized.POST("/file/upload", handler.SaveFile)

		// follow
		authorized.GET("/user/followStatus", handler.FollowStatus)
		authorized.POST("/user/clickFollow", handler.ClickFollow)

		// article
		authorized.GET("/articleList", handler.GetArticleList)
		authorized.POST("/publish", handler.PublishArticle)
		authorized.POST("/deleteArticle", handler.DeleteArticle)
		authorized.GET("/articleSimple/:aid", handler.GetArticleSimple)
		authorized.GET("/article/:aid", handler.GetArticleByAid)

		// comment
		authorized.GET("/comments", handler.GetCommentList)
		authorized.POST("/comments/add", handler.AddComment)
		authorized.POST("/comments/del", handler.RemoveComment)

		// favorite
		authorized.GET("/article/savedStatus", handler.GetSavedStatus)
		authorized.POST("/article/clickSave", handler.ClickSave)

		// thumb up
		authorized.GET("/like/status", handler.GetLikeStatus)
		authorized.POST("/like/thumbUp", handler.ClickLike)
		authorized.POST("/like/thumbDown", handler.ClickDislike)

		// chat
		authorized.GET("/chats", handler.GetChatList)
		authorized.POST("/chat/add", handler.AddChat)

		// message
		authorized.GET("/messageList", handler.GetMessage)
	}

	return r
}

// Check if a user is logged in
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		token := util.BearerAuthHeader(authHeader)
		if token == "" {
			// abort request, preveting it from going to service level
			c.Abort()
			c.JSON(http.StatusUnauthorized, response.FailureMsg("invalid user"))
			return
		}
		c.Set("token", token)
		c.Next()
	}
}

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		origin := c.Request.Header.Get("Origin") //请求头部
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", "*") // 可将 * 替换为指定的域名
			c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
			c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
			c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
			c.Header("Access-Control-Allow-Credentials", "true")
		}
		//允许类型校验
		if method == "OPTIONS" {
			c.JSON(http.StatusOK, "ok!")
		}

		defer func() {
			if err := recover(); err != nil {
				log.Fatalf("HttpError: %v", err)
			}
		}()

		c.Next()
	}
}
