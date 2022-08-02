package pool

import (
	"fmt"
	"time"

	"github.com/iberis9611/go-blog-application/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func init() {

	user := config.GetConfig().MySQL.User       // 数据库用户名
	pwd := config.GetConfig().MySQL.Password    // 数据库密码
	host := config.GetConfig().MySQL.Host       // 数据库地址
	port := config.GetConfig().MySQL.Port       // 数据库端口
	dbName := config.GetConfig().MySQL.Name     // 数据库名称
	timeout := config.GetConfig().MySQL.Timeout // 超时连接时长

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local&timeout=%s", user, pwd, host, port, dbName, timeout)
	var err error

	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect mysql, error=" + err.Error())
	}

	sqlDB, _ := db.DB()
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
}

func GetDB() *gorm.DB {
	return db
}
