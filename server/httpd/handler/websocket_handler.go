package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/iberis9611/go-blog-application/ws"
)

// 全局变量upgrader可以将http协议升级为websocket协议
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// 处理Web Socket数据请求，返回响应
func RunSocekt(c *gin.Context) {
	// 获取用户昵称
	user := c.Query("nickname")

	// 升级http协议为websocket协议
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Fatal("Error on websocket connection:", err.Error())
		return
	}

	// 创建一个用户实例
	client := &ws.Client{
		Nickname: user,
		Conn:     conn,
		Send:     make(chan []byte),
	}

	// send the client instance to Server's join channel
	ws.MyServer.Join <- client

	// 后台读写
	go client.Read()
	go client.Write()
}
