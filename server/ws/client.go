package ws

import (
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	Nickname string
	Conn     *websocket.Conn
	Send     chan []byte
}

func (c *Client) Read() {
	defer func() {
		MyServer.Leave <- c
		c.Conn.Close()
	}()

	for {
		_, b, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println("Error on read message:", err.Error())
			MyServer.Leave <- c
			c.Conn.Close()
			break
		}

		// send the byte message to server's broadcast channel
		MyServer.Broadcast <- b
	}
}

func (c *Client) Write() {
	defer func() {
		c.Conn.Close()
	}()

	for message := range c.Send {
		if err := c.Conn.WriteMessage(websocket.BinaryMessage, message); err != nil {
			log.Println("Error on write message:", err.Error())
		}
	}
}
