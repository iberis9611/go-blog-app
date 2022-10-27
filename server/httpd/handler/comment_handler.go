package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/model"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

func AddComment(c *gin.Context) {

	// var comment model.Comment 声明, comment被初始化, 并赋初始值
	var comment model.Comment
	c.ShouldBindJSON(&comment)
	err := service.AddComment(&comment)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("发生未知错误！"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(comment))
}

func GetCommentList(c *gin.Context) {

	token := c.MustGet("token").(string)
	article_aid := c.Query("aid")
	commentList, err := service.GetAllCommentsByArticleId(article_aid, token)
	if err != nil {
		c.JSON(http.StatusOK, response.FailureMsg("加载评论失败"))
		return
	}
	c.JSON(http.StatusOK, response.SuccessMsg(commentList))
}

func RemoveComment(c *gin.Context) {

	cid := c.Query("cid")
	err := service.RemoveComment(cid)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("出现未知错误！"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}
