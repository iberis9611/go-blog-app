package service

import (
	"errors"

	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
)

// 校验用户名是否已经存在
func ValidateUsername(username string) bool {
	db := pool.GetDB()

	var countUsername int64
	// SELECT count(1) FROM users WHERE username = ?
	db.Model(&model.User{}).Where("username = ?", username).Count(&countUsername)
	if countUsername != 0 {
		return true
	}

	return false
}

// 校验昵称是否已存在
func ValidateNickname(nickname string) bool {
	db := pool.GetDB()

	var countNickname int64
	// SELECT count(1) FROM users WHERE username = ?
	db.Model(&model.User{}).Where("nickname = ?", nickname).Count(&countNickname)
	if countNickname != 0 {
		return true
	}

	return false
}

// 注册
func Register(user *model.User) (err error) {
	// 1 连数据库
	db := pool.GetDB()
	// 2 判断用户名或昵称是否已存在
	var countUsername int64
	db.Model(&user).Where("username = ?", user.Username).Count(&countUsername)
	var countNickname int64
	db.Model(&user).Where("nickname = ?", user.Nickname).Count(&countNickname)
	if countUsername != 0 || countNickname != 0 {
		return errors.New("用户名已存在或昵称已存在")
	}
	// 3 创建用户
	db.Create(&user)

	return nil
}

// 登录
func Login(user *model.User) bool {
	db := pool.GetDB()

	var queryUser *model.User
	db.First(&queryUser, "username = ?", user.Username)

	user.Uuid = queryUser.Uuid

	return queryUser.Password == user.Password
}

// 获得个人信息
func GetUserInfo(uuid string) model.User {
	db := pool.GetDB()

	var queryUser *model.User
	db.Select("nickname", "avatar", "intro", "gender", "birthday", "email", "phone", "address", "create_at", "update_at").First(&queryUser, "uuid = ?", uuid)
	return *queryUser
}

// 通过aid获取用户名片
func GetNameCardByAid(aid string, token string) model.UserWithFollow {
	db := pool.GetDB()

	var user *model.UserWithFollow
	// 左外连接+标量子查询
	db.Raw(`SELECT u.uuid, u.nickname, u.intro, u.avatar, u.follower, u.like_received, u.article_published, f.status follow_status 
		FROM users u
		LEFT OUTER JOIN friends f ON f.following_uuid = u.uuid AND f.user_uuid = ?
		WHERE u.uuid = (SELECT user_uuid FROM articles WHERE aid = ?)`, token, aid).Scan(&user)

	return *user
}

// 通过uuid获取用户名片
func GetNameCardByUuid(uuid string, token string) model.UserWithFollow {
	db := pool.GetDB()

	var user *model.UserWithFollow
	// 左外连接
	db.Raw(`SELECT u.uuid, u.nickname, u.intro, u.avatar, u.birthday, u.gender, u.address, u.follower, u.following, 
		u.article_liked, u.article_saved, u.like_received, u.article_published, f.status follow_status 
		FROM users u
		LEFT OUTER JOIN friends f ON f.following_uuid = u.uuid AND f.user_uuid = ?
		WHERE u.uuid = ?`, token, uuid).Scan(&user)

	return *user
}

// 修改用户信息
// user中存的是用户键入的新信息
func ModifyUserInfo(user *model.User, uuid string) error {
	db := pool.GetDB()

	var queryUser *model.User
	db.First(&queryUser, "uuid = ?", uuid)
	if queryUser.Id == 0 {
		return errors.New("用户不存在")
	}

	queryUser.Intro = user.Intro
	queryUser.Gender = user.Gender
	queryUser.Email = user.Email
	queryUser.Phone = user.Phone
	queryUser.Address = user.Address
	queryUser.Birthday = user.Birthday
	queryUser.Avatar = user.Avatar

	db.Save(&queryUser) // UPDATE
	return nil
}

// 删除用户
