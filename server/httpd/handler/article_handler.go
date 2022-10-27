package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/model"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

// 查询文章列表
func GetArticleList(c *gin.Context) {
	uuid := c.Query("uuid")
	searchType := c.Query("search_type")
	page, _ := strconv.Atoi(c.Query("page"))
	perPage, _ := strconv.Atoi(c.Query("per_page"))

	articleList, err := service.GetArticles(searchType, uuid, page, perPage)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("搜索类型不支持"))
		return
	}
	c.JSON(http.StatusOK, response.SuccessMsg(articleList))
}

// 发布或修改文章
func PublishArticle(c *gin.Context) {
	token := c.MustGet("token").(string)

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
	token := c.MustGet("token").(string)

	aids := c.Query("aids")
	err := service.DeleteArticle(aids, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}

// 通过aid查询某一文章（包含用户点赞和收藏状态）：用于文章详情页的展示功能
func GetArticleByAid(c *gin.Context) {

	token := c.MustGet("token").(string)

	aid := c.Param("aid")
	article, err := service.GetArticleByAid(aid, token)

	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(article))
}

// 通过aid查询文章:用于发布和修改文章的操作
func GetArticleSimple(c *gin.Context) {

	aid := c.Param("aid")
	article, err := service.GetArticleByAidSimple(aid)

	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("文章不存在"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(article))
}
