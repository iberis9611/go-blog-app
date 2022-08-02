package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/httpd/router"
	"github.com/iberis9611/go-blog-application/model"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

// 发布/修改文章
func PublishArticle(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	aid := c.Query("aid")

	var article model.Article
	c.ShouldBindJSON(&article)
	var err error

	// 修改逻辑
	if aid != "" {
		err = service.ModifyArticle(aid, &article)
		if err != nil {
			c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
			return
		}

		c.JSON(http.StatusOK, response.SuccessMsg(nil))
		return
	}

	// 发布逻辑
	err = service.PublishArticle(&article, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}

// 删除文章
func DeleteArticle(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	aids := c.Query("aids")
	err := service.DeleteArticle(aids)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}

// 查看全部文章
func GetArticleList(c *gin.Context) {
	c.JSON(http.StatusOK, response.SuccessMsg(service.GetAllArticles()))
}

// 通过aid查询某一文章（包含用户点赞和收藏状态）
func GetArticleByAid(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	aid := c.Param("aid")
	article, err := service.GetArticleByAid(aid, token)

	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("文章不存在"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(article))
}

// 通过aid查询文章
func GetArticleSimple(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	aid := c.Param("aid")
	article, err := service.GetArticleByAidSimple(aid)

	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("文章不存在"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(article))
}

// 查询用户发布过的文章
func GetArticlesPublishedByOne(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	uuid := c.Query("uuid")
	c.JSON(http.StatusOK, response.SuccessMsg(service.GetArticlesPublished(uuid)))
}

// 查询用户赞过的文章
func GetArticlesLikedByOne(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	uuid := c.Query("uuid")
	c.JSON(http.StatusOK, response.SuccessMsg(service.GetArticlesLiked(uuid)))
}

// 查询用户收藏的文章
func GetArticlesSavedByOne(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	uuid := c.Query("uuid")
	c.JSON(http.StatusOK, response.SuccessMsg(service.GetArticlesSaved(uuid)))
}
