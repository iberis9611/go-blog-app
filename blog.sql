CREATE DATABASE IF NOT EXISTS blog;
 
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
    `uuid` VARCHAR(150) NOT NULL COMMENT 'uuid',
    `username` VARCHAR(30) NOT NULL COMMENT '用户名',
    `password` VARCHAR(30) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(30) NOT NULL COMMENT '昵称',
    `gender` VARCHAR(2) DEFAULT '' NOT NULL COMMENT '性别',
    `birthday` DATETIME(3) DEFAULT NULL COMMENT '生日',
    `address` VARCHAR(50) DEFAULT '' NOT NULL COMMENT '住址',
    `email` VARCHAR(80) DEFAULT '' NOT NULL COMMENT '邮箱',
    `phone` CHAR(11) DEFAULT '' NOT NULL COMMENT '手机号码',
    `intro` VARCHAR(100) DEFAULT '' NOT NULL COMMENT '个人简介',
    `avatar` VARCHAR(260) DEFAULT '' NOT NULL COMMENT '头像',
    `create_at` DATETIME(3) NOT NULL COMMENT '注册时间',
    `update_at` DATETIME(3) DEFAULT NULL COMMENT '修改时间',
    `delete_at` BIGINT DEFAULT 0 NOT NULL COMMENT '删除状态',
    `like_received` INT UNSIGNED DEFAULT 0 NOT NULL COMMENT '获赞',
    `article_liked` SMALLINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '点赞的文章',
    `article_saved` SMALLINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '收藏的文章',
    `article_published` SMALLINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '发布的文章',
    `following` INT UNSIGNED DEFAULT 0 NOT NULL COMMENT '关注的人',
    `follower` INT UNSIGNED DEFAULT 0 NOT NULL COMMENT '粉丝',
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_user_uuid` (`uuid`),
    UNIQUE Index `idx_user_username` (`username`),
    UNIQUE Index `idx_user_nickname` (`nickname`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '用户表';

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles`(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
    `aid` VARCHAR(150) NOT NULL COMMENT '文章id',
    `user_uuid` VARCHAR(150) NOT NULL COMMENT '用户uuid',
    `status` TINYINT UNSIGNED DEFAULT 1 NOT NULL COMMENT '文章状态',
    `view_count` BIGINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '点击量',
    `like_count` INT UNSIGNED DEFAULT 0 NOT NULL COMMENT '点赞量',
    `dislike_count` INT UNSIGNED DEFAULT 0 NOT NULL COMMENT '点踩量',
    `comment_count` SMALLINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '评论量',
    `save_count` SMALLINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '收藏量',
    `create_at` DATETIME(3) DEFAULT NULL COMMENT '发布时间',
    `update_at` DATETIME(3) DEFAULT NULL COMMENT '修改时间',
    `delete_at` BIGINT DEFAULT 0 NOT NULL COMMENT '删除状态',
    `title` VARCHAR(100) NOT NULL COMMENT '文章标题',
    `cover` VARCHAR(260) COMMENT '文章封面',
    `content` LONGTEXT NOT NULL COMMENT '文章内容',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `idx_article_aid` (`aid`),
    INDEX `idx_article_title` (`title`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '文章表';

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments`(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '评论id',
    `cid` VARCHAR(150) NOT NULL COMMENT '评论的item_id',
    `sent_from` VARCHAR(150) NULL COMMENT '评论发布者uuid',
    `sent_to` VARCHAR(150) NULL COMMENT '评论接收者uuid',
    `article_aid` VARCHAR(150) NOT NULL COMMENT '被评论的文章aid',
    `comment_content` VARCHAR(1000) NOT NULL COMMENT '评论内容',
    `like_count` SMALLINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '点赞量',
    `dislike_count` SMALLINT UNSIGNED DEFAULT 0 NOT NULL COMMENT '点踩量',
    `status` TINYINT NOT NULL COMMENT '评论状态',
    `create_at` DATETIME(3) DEFAULT NULL COMMENT '评论发布时间',
    `delete_at` BIGINT DEFAULT 0 NOT NULL COMMENT '删除状态',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '评论表';

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes`(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
    `user_uuid` VARCHAR(150) NOT NULL COMMENT '用户uuid',
    `author_uuid` VARCHAR(150) NOT NULL COMMENT '作者uuid',
    `item_id` VARCHAR(150) NOT NULL COMMENT '文章aid或评论cid',
    `status` TINYINT DEFAULT 0 NOT NULL COMMENT '点赞状态',
    `liked_at` DATETIME(3) DEFAULT NULL COMMENT '点赞时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '点赞表';

DROP TABLE IF EXISTS `collections`;
CREATE TABLE IF NOT EXISTS `collections`(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
    `user_uuid` VARCHAR(150) NOT NULL COMMENT '用户uuid',
    `article_aid` VARCHAR(150) NOT NULL COMMENT '文章aid',
    `status` TINYINT NOT NULL COMMENT '收藏状态',
    `saved_at` DATETIME(3) DEFAULT NULL COMMENT '收藏时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '收藏表';

DROP TABLE IF EXISTS `friends`;
CREATE TABLE IF NOT EXISTS `friends`(
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'id',
    `user_uuid` VARCHAR(150) NOT NULL COMMENT '用户uuid',
    `following_uuid` VARCHAR(150) NOT NULL COMMENT '被关注者uuid',
    `status` TINYINT NOT NULL COMMENT '关注状态',
    `follow_at` DATETIME(3) DEFAULT NULL COMMENT '关注时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '关注表';

Drop TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息id',
    `from` VARCHAR(150) NOT NULL COMMENT '发送者uuid',
    `to` VARCHAR(150) NOT NULL COMMENT '接收者uuid',
    `thumbnail` TEXT COMMENT '缩略图',
    `url` VARCHAR(350) DEFAULT NULL COMMENT '文件或图片地址',
    `create_at` DATETIME(3) DEFAULT NULL COMMENT '创建时间',
    `update_at` DATETIME(3) DEFAULT NULL COMMENT '更新时间',
    `content` VARCHAR(2500) DEFAULT NULL COMMENT '消息内容',
    `message_type` SMALLINT DEFAULT NULL COMMENT '''消息类型：1单聊，2群聊''',
    `content_type` SMALLINT DEFAULT NULL COMMENT '''消息内容类型：1文字，2语音，3视频''',
    PRIMARY KEY (`id`),
    INDEX `idx_message_from` (`from`),
    INDEX `idx_message_to` (`to`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '消息表';

Drop TABLE IF EXISTS `chats`;
CREATE TABLE IF NOT EXISTS `chats`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '聊天id',
    `user_uuid` VARCHAR(150) NOT NULL COMMENT '用户uuid',
    `to_uuid` VARCHAR(150) NOT NULL COMMENT 'to_uuid',
    `chat_nickname` VARCHAR(30) NOT NULL COMMENT '对方昵称',
    `chat_avatar` VARCHAR(260) DEFAULT '' NOT NULL COMMENT '头像',
    `update_at` DATETIME(3) DEFAULT NULL COMMENT '修改时间',
    `message_type` SMALLINT DEFAULT NULL COMMENT '''消息类型：1单聊，2群聊''',
    `message` VARCHAR(100) DEFAULT NULL COMMENT '最新消息',
    PRIMARY KEY (`id`),
    INDEX `idx_chat_uuid` (`user_uuid`),
    INDEX `idx_chat_nickname` (`chat_nickname`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '聊天表';