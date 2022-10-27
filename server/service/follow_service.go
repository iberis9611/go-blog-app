package service

import (
	"errors"
	"time"

	"github.com/iberis9611/go-blog-application/dao/pool"
	"github.com/iberis9611/go-blog-application/model"
)

// 关注状态
// following 被关注者的uuid，user 用户uuid
func FollowStatus(aid string, user_uuid string) int8 {
	db := pool.GetDB()

	var friend *model.Friend

	// 标量子查询（子查询返回单个值）
	db.Raw("SELECT id, status FROM friends WHERE user_uuid='693588e1-5265-422a-ade4-256370f8b088' AND following_uuid= (SELECT user_uuid FROM articles WHERE aid = ?)", aid).Scan(&friend)
	if friend.Id == 0 {
		return 0
	}

	return friend.Status
}

// 点击关注
// following 被关注者的uuid，user 用户uuid
func ClickFollow(follow_uuid string, my_uuid string) error {
	db := pool.GetDB()

	// 判断即将关注的用户是否存在
	var following *model.User
	db.First(&following, "uuid = ?", follow_uuid)
	if following.Id == 0 || following.DeleteAt == 1 {
		return errors.New("用户不存在")
	}

	var user *model.User
	db.First(&user, "uuid = ?", my_uuid)
	if user.Id == 0 || user.DeleteAt == 1 {
		return errors.New("用户不存在")
	}

	// 自己不能关注自己
	if following.Uuid == user.Uuid {
		return errors.New("不能关注自己")
	}

	var friend *model.Friend
	db.First(&friend, "following_uuid = ? AND user_uuid = ?", following.Uuid, my_uuid)

	// 判断关注记录是否存在 不存在则创建记录
	if friend.Id == 0 {
		friend.FollowingUuid = following.Uuid
		friend.UserUuid = my_uuid
		friend.FollowAt = time.Now()
		friend.Status = 1
		// friend表 新增记录
		db.Create(&friend)
		// 被关注者粉丝加1
		db.Model(&following).Update("follower", following.Follower+1)
		// 用户关注的人加1
		db.Model(&user).Update("following", user.Following+1)
		return nil
	}
	// 记录存在
	if friend.Status == 0 {
		db.Model(&friend).Updates(map[string]interface{}{"follow_at": time.Now(), "status": 1})
		db.Model(&following).Update("follower", following.Follower+1)
		db.Model(&user).Update("following", user.Following+1)
		return nil
	}
	if friend.Status == 1 {
		db.Model(&friend).Update("status", 0)
		db.Model(&following).Update("follower", following.Follower-1)
		db.Model(&user).Update("following", user.Following-1)
		return nil
	}
	return errors.New("未知错误")
}
