package config

import (
	"fmt"

	"github.com/spf13/viper"
)

// toml配置文件解析器
type TomlConfig struct {
	AppName    string
	MySQL      MySQLConfig
	StaticPath PathConfig
	// Log            LogConfig
	// MsgChannelType MsgChannelType
}

// MySQL相关配置
type MySQLConfig struct {
	Host     string
	Port     int
	Name     string
	User     string
	Password string
	Timeout  string
}

// 相关地址信息，例如静态文件地址
type PathConfig struct {
	FilePath string
}

// 日志保存地址
// type LogConfig struct {
// 	Path  string
// 	Level string
// }

// 消息队列类型及其消息队列相关信息
// gochannel为单机使用go默认的channel进行消息传递
// kafka是使用kafka作为消息队列，可以分布式扩展消息聊天程序
// type MsgChannelType struct {
// 	ChannelType string
// 	KafkaHosts  string
// 	KafkaTopic  string
// }

var c TomlConfig

// 初始化
func init() {
	// 设置文件名
	viper.SetConfigName("config")
	// 设置文件类型
	viper.SetConfigType("toml")
	// 设置文件路径，可以多个viper会根据设置顺序依次查找
	viper.AddConfigPath(".")
	viper.AutomaticEnv()
	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %s", err))
	}

	viper.Unmarshal(&c)
}

func GetConfig() TomlConfig {
	return c
}
