package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/model"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

func GetChatList(c *gin.Context) {
	token := c.MustGet("token").(string)
	chatList, err := service.GetChatList(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
	}

	c.JSON(http.StatusOK, response.SuccessMsg(chatList))
}

func AddChat(c *gin.Context) {
	var chat model.Chat
	c.ShouldBindJSON(&chat)
	err := service.AddChat(&chat)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg(err.Error()))
	}

	c.JSON(http.StatusOK, response.SuccessMsg(chat))
}
