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

// function formatTime(time) {
//     var date = new Date(time)
//     var year = date.getFullYear()
//     var month = date.getMonth() + 1
//     month = month < 10 ? ('0' + month) : month
//     var day = date.getDate()
//     day = day < 10 ? ('0' + day) : day
//     return year + '-' + month + '-' + day
// }