package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

// GetSavedStatus 查询收藏状态
func GetSavedStatus(c *gin.Context) {
	token := c.MustGet("token").(string)

	// 获取文章aid
	article_aid := c.Query("aid")

	status, err := service.GetSavedStatus(article_aid, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("文章不存在"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(status))
}

// ClickSave 点击收藏按钮
func ClickSave(c *gin.Context) {
	token := c.MustGet("token").(string)

	// token正确
	article_aid := c.Query("aid")
	err := service.Save(article_aid, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("发生未知错误"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}
