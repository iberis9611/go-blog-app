### server:
## Initialize Go app
go mod init github.com/iberis9611/go-react-application

## Install Gin
go get -u github.com/gin-gonic/gin

## Install Gorm
go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite

# Install Viper
go get -u github.com/spf13/viper

# Install protobuf and protoc-gen-gogo using homebrew

# 使用websocket
# 1 Install gorilla
go get -u github.com/gorilla/websocket
go get -u go.mongodb.org/mongo-driver/mongo
# 2 在controller下新建websocket.go 实现服务端业务逻辑部分

# 3 在router.go路由器中添加websocket连接请求操作的路由

# 使用protoc-gen-gogo生成message.pb.go文件
oliver at olivers-mac in protocol
$ protoc --gogo_out=. message.proto
