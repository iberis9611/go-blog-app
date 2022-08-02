package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/httpd/router"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

func GetLikeStatus(c *gin.Context) {

	// 鉴权
	token := router.BearerAuthHeader(c)

	// token异常
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	// token正确
	item_id := c.Query("aid") // 获取文章aid
	status, err := service.GetLikeStatus(item_id, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("文章不存在"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(status))
}

func ClickLike(c *gin.Context) {

	// 鉴权
	token := router.BearerAuthHeader(c)

	// token异常
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	// token正确
	item_id := c.Query("item_id")
	err := service.Like(item_id, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("未知错误"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}

func ClickDislike(c *gin.Context) {

	// 鉴权
	token := router.BearerAuthHeader(c)

	// token异常
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	// token正确
	item_id := c.Query("item_id")
	err := service.Dislike(item_id, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("未知错误"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}
