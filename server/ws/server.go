package ws

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/iberis9611/go-blog-application/model"
	"github.com/iberis9611/go-blog-application/pkg/common/constant"
	"github.com/iberis9611/go-blog-application/service"
)

var MyServer = NewServer()

type Server struct {
	// All Users in this chatroom
	Users     map[string]*Client
	mutex     *sync.Mutex
	Broadcast chan []byte
	Join      chan *Client
	Leave     chan *Client
}

// NewServer constructs an instance returning a pointer
func NewServer() *Server {
	return &Server{
		Users:     map[string]*Client{},
		mutex:     &sync.Mutex{},
		Broadcast: make(chan []byte),
		Join:      make(chan *Client),
		Leave:     make(chan *Client),
	}
}

// Start processes user registration, unregistration and message broadcast.
func (s *Server) Start() {
	for {
		select {
		case user := <-s.Join:
			s.add(user)
		case message := <-s.Broadcast:
			s.broadcast(message)
		case user := <-s.Leave:
			s.leave(user)
		}
	}
}

func (s *Server) add(user *Client) {
	if _, ok := s.Users[user.Nickname]; !ok {
		s.Users[user.Nickname] = user
		log.Printf("%s joined the chat, Total: %d\n", user.Nickname, len(s.Users))
	}
}

func (s *Server) leave(user *Client) {
	if _, ok := s.Users[user.Nickname]; ok {
		close(user.Send)
		delete(s.Users, user.Nickname)
	}
}

func (s *Server) broadcast(message []byte) {

	msg := &model.Message{}
	err := json.Unmarshal(message, &msg)
	if err != nil {
		log.Println("Unmarshal error: ", err)
	}

	log.Printf("%T, %v", msg, msg)

	if msg.ContentType == constant.TEXT {
		// check if the sender exists in the Users map, if so, save the message to the database
		if _, ok := s.Users[msg.From]; ok {
			saveMessage(msg)
		}

		// DM
		if msg.MessageType == constant.MESSAGE_TYPE_USER {
			// Check if the recipient exists, if so, send the byte message to its channel and its write function will write it
			if user, ok := s.Users[msg.To]; ok {
				if b, err := json.Marshal(msg); err == nil {
					user.Send <- b
				}
			}
		}
	}
}

func saveMessage(message *model.Message) {
	service.SaveMessage(*message)
}
