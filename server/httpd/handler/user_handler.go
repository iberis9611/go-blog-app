package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/model"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

// 登录
func Login(c *gin.Context) {
	// 声明接受的变量
	var user model.User
	c.ShouldBindJSON(&user)
	// 如果用户名存在，且密码正确，返回uuid（token）
	if service.Login(&user) {
		c.JSON(http.StatusOK, response.SuccessMsg(user))
		return
	}
	// 否则报错
	c.JSON(http.StatusOK, response.FailureMsg("登录失败！"))
}

// 注册
func Register(c *gin.Context) {

	var user model.User
	c.ShouldBindJSON(&user)

	err := service.Register(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("用户名或昵称已存在"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(user))
}

// 获取用户个人简介信息
func GetUserProfileInfo(c *gin.Context) {

	token := c.MustGet("token").(string)

	c.JSON(http.StatusOK, response.SuccessMsg(service.GetUserInfo(token)))
}

// 通过uuid查询用户详情
func GetNameCardByUuid(c *gin.Context) {

	token := c.MustGet("token").(string)

	var namecard model.UserWithFollow
	uuid := c.Param("uuid")
	namecard = service.GetNameCardByUuid(uuid, token)

	c.JSON(http.StatusOK, response.SuccessMsg(namecard))
}

func ValidateUsername(c *gin.Context) {
	username := c.Query("username")

	c.JSON(http.StatusOK, response.SuccessMsg(service.ValidateUsername(username)))
}

func ValidateNickname(c *gin.Context) {
	nickname := c.Query("nickname")

	c.JSON(http.StatusOK, response.SuccessMsg(service.ValidateNickname(nickname)))
}

// 修改用户资料
func ModifyUserProfile(c *gin.Context) {

	token := c.MustGet("token").(string)

	var user model.User
	c.ShouldBindJSON(&user)
	err := service.ModifyUserInfo(&user, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("用户不存在"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(user))
}
