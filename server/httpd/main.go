package main

import (
	"net/http"
	"time"

	"github.com/iberis9611/go-blog-application/httpd/router"
	"github.com/iberis9611/go-blog-application/ws"
)

func main() {

	r := router.NewRouter()

	go ws.MyServer.Start()

	s := &http.Server{
		Addr:           ":8000",
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	s.ListenAndServe()
}
