package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

// 获取消息列表
func GetMessage(c *gin.Context) {

	messageType, _ := strconv.Atoi(c.Query("message_type"))
	uuid := c.Query("uuid")
	friendNickname := c.Query("friend_nickname")

	messages, err := service.GetMessages(int32(messageType), uuid, friendNickname)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(messages))
}
