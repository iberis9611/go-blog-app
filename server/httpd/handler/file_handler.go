package handler

import (
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/iberis9611/go-blog-application/config"
	"github.com/iberis9611/go-blog-application/httpd/router"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
)

// 上传文件
func SaveFile(c *gin.Context) {

	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	// 上传单个图片
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.FailureMsg(err.Error()))
	}
	// 获取文件名称
	fileName := file.Filename

	index := strings.LastIndex(fileName, ".")
	suffix := fileName[index:] // 文件后缀 如jpg,jpeg,png...
	prefix := uuid.New().String()
	newFileName := prefix + suffix

	// 参数： 文件 文件名
	err = c.SaveUploadedFile(file, config.GetConfig().StaticPath.FilePath+newFileName)
	if err != nil {
		c.JSON(http.StatusOK, response.FailureMsg(err.Error()))
		return
	}

	// 上传成功 返回文件名
	c.JSON(http.StatusOK, response.SuccessMsg(newFileName))
}

// 前端通过文件名称获取文件流，显示文件
func GetFile(c *gin.Context) {
	fileName := c.Param("fileName")
	data, _ := ioutil.ReadFile(config.GetConfig().StaticPath.FilePath + fileName)
	c.Writer.Write(data)
}
