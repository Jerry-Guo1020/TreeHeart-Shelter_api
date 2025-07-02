-- 创建数据库
CREATE DATABASE IF NOT EXISTS Tree DEFAULT CHARACTER SET 'utf8mb4';
USE Tree;

-- 1、用户类型表，区分普通用户和管理员
CREATE TABLE UserType (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 用户类型id
    name VARCHAR(30) NOT NULL UNIQUE,                                      -- 用户类型名称
    INDEX idx_name (name)                                                  -- 索引功能
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2、用户表(微信openid作为唯一标识)
CREATE TABLE User (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                                   -- 用户id
    userTypeId BIGINT NOT NULL,                                                             -- 用户类型的id
    openid VARCHAR(255) NOT NULL UNIQUE,                                                    -- 微信openid
    nickname VARCHAR(50) NOT NULL,                                                          -- 用户昵称
    avatar VARCHAR(255) NOT NULL,                                                           -- 用户头像
    username VARCHAR(30) NOT NULL DEFAULT '树洞用户',                                        -- 用户名，默认值
    sex ENUM('男', '女') NOT NULL DEFAULT '男',                                             -- 性别，默认男
    grade ENUM('大一', '大二', '大三', '大四'),                                              -- 年级设置
    college VARCHAR(50),                                                                    -- 大学名称
    subCollege VARCHAR(50),                                                                 -- 学院
    major VARCHAR(50),                                                                      -- 专业名称
    isNewUser TINYINT(1) NOT NULL DEFAULT 1,                                                -- 是否为新用户
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                                 -- 注册时间
    updateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,              -- 更新时间
    INDEX idx_openid (openid),                                                              -- 索引功能
    FOREIGN KEY (userTypeId) REFERENCES UserType(id) ON DELETE CASCADE                      -- 外键关联用户类型
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3、关注表（多对多：关注者和被关注者）
CREATE TABLE UserFollow (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                                   -- 关注记录的id
    followerId BIGINT NOT NULL,                                                             -- 关注者用户的id
    followedId BIGINT NOT NULL,                                                             -- 被关注者用户id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                                 -- 关注时间
    INDEX idx_followerId (followerId),                                                      -- 索引
    INDEX idx_followedId (followedId),                                                      -- 索引
    FOREIGN KEY (followerId) REFERENCES User(id) ON DELETE CASCADE,                         -- 外键：关注者
    FOREIGN KEY (followedId) REFERENCES User(id) ON DELETE CASCADE                          -- 外键：被关注者
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4、帖子类型表
CREATE TABLE PostType (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                                   -- 类型id
    name VARCHAR(30) NOT NULL,                                                              -- 类型名称
    INDEX idx_name (name)                                                                   -- 索引
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5、帖子照片表（动态图片）
CREATE TABLE PostImg (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                                                   -- 图片id
    browser VARCHAR(100) NOT NULL,                                                          -- 存储桶名
    uri VARCHAR(100),                                                                       -- 图片url
    status ENUM('待上传', '上传中', '已完成') NOT NULL DEFAULT '待上传',                    -- 图片上传状态
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                                 -- 创建时间
    INDEX idx_status (status)                                                               -- 状态索引
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6、帖子表
CREATE TABLE Post (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                   -- 帖子的id
    uid BIGINT NOT NULL,                                                    -- 用户id
    typeId BIGINT NOT NULL,                                                 -- 帖子类id
    title VARCHAR(100) NOT NULL,                                            -- 帖子的标题
    content TEXT NOT NULL,                                                  -- 帖子的内容
    imgId BIGINT,                                                           -- 配图id
    likeCount INT DEFAULT 0,                                                -- 点赞数
    commentCount INT DEFAULT 0,                                             -- 评论数
    collectCount INT DEFAULT 0,                                             -- 收藏数
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                 -- 发布的时间
    INDEX idx_uid (uid),                                                    -- 用户索引
    INDEX idx_typeId (typeId),                                              -- 类型索引
    INDEX idx_imgId (imgId),                                                -- 图片索引
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,                -- 外键：用户
    FOREIGN KEY (typeId) REFERENCES PostType(id) ON DELETE CASCADE,         -- 外键：类型
    FOREIGN KEY (imgId) REFERENCES PostImg(id) ON DELETE CASCADE            -- 外键：图片
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7、点赞表
CREATE TABLE PostLike (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                   -- 点赞id
    uid BIGINT NOT NULL,                                                    -- 用户id
    postId BIGINT NOT NULL,                                                 -- 帖子id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                 -- 创建时间
    INDEX idx_uid (uid),                                                    -- 用户索引
    INDEX idx_postId (postId),                                              -- 帖子索引
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,                -- 外键：用户
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE              -- 外键：帖子
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8、评论表
CREATE TABLE PostComment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                   -- 评论id
    uid BIGINT NOT NULL,                                                    -- 用户id
    postId BIGINT NOT NULL,                                                 -- 帖子id
    content VARCHAR(255) NOT NULL,                                          -- 评论内容
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                 -- 评论时间
    INDEX idx_uid (uid),                                                    -- 用户索引
    INDEX idx_postId (postId),                                              -- 帖子索引
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,                -- 外键：用户
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE              -- 外键：帖子
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9、收藏表
CREATE TABLE PostCollect (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 收藏id
    uid BIGINT NOT NULL,                                                   -- 用户id
    postId BIGINT NOT NULL,                                                -- 帖子id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                -- 创建时间
    INDEX idx_uid (uid),                                                   -- 用户索引
    INDEX idx_postId (postId),                                             -- 帖子索引
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,               -- 外键：用户
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE             -- 外键：帖子
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10、活动表
CREATE TABLE Activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 活动id
    uid BIGINT NOT NULL,                                                   -- 用户id（发布者）
    title VARCHAR(100) NOT NULL,                                           -- 活动标题
    content TEXT NOT NULL,                                                 -- 活动内容
    imgId BIGINT,                                                          -- 活动配图id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                -- 创建时间
    INDEX idx_uid (uid),                                                   -- 用户索引
    INDEX idx_imgId (imgId),                                               -- 图片索引
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,               -- 外键：用户
    FOREIGN KEY (imgId) REFERENCES PostImg(id) ON DELETE CASCADE           -- 外键：图片
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11、活动报名表
CREATE TABLE ActivityJoin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 报名记录id
    uid BIGINT NOT NULL,                                                   -- 用户id
    activityId BIGINT NOT NULL,                                            -- 活动id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                -- 创建时间
    INDEX idx_uid (uid),                                                   -- 用户索引
    INDEX idx_activityId (activityId),                                     -- 活动索引
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,               -- 外键：用户
    FOREIGN KEY (activityId) REFERENCES Activity(id) ON DELETE CASCADE     -- 外键：活动
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12、心理测评类型/卷表
CREATE TABLE Assessment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 测评卷id
    name VARCHAR(100) NOT NULL,                                            -- 测评类型名称
    description TEXT,                                                      -- 测评简介
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP                 -- 创建时间
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13、测评题库表（选项按顺序，分数由后端判定）
CREATE TABLE AssessmentQuestion (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 题目id
    assessmentId BIGINT NOT NULL,                                          -- 所属测评卷id
    content TEXT NOT NULL,                                                 -- 题目内容
    options JSON NOT NULL,                                                 -- 选项内容（如["A. 没有", "B. 有一点", "C. 比较多", "D. 很严重"]）
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                -- 创建时间
    FOREIGN KEY (assessmentId) REFERENCES Assessment(id) ON DELETE CASCADE -- 外键：所属测评卷
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14、评分区间规则表
CREATE TABLE AssessmentRule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 规则id
    assessmentId BIGINT NOT NULL,                                          -- 测评卷id
    minScore INT NOT NULL,                                                 -- 区间最低分
    maxScore INT NOT NULL,                                                 -- 区间最高分
    level VARCHAR(20),                                                     -- 状态/级别（如“正常”、“轻度焦虑”）
    report TEXT NOT NULL,                                                  -- 文字评价内容
    FOREIGN KEY (assessmentId) REFERENCES Assessment(id) ON DELETE CASCADE -- 外键：所属测评卷
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15、用户测评历史记录表
CREATE TABLE UserAssessmentRecord (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  -- 用户测评记录id
    uid BIGINT NOT NULL,                                                   -- 用户id
    assessmentId BIGINT NOT NULL,                                          -- 测评卷id
    score INT NOT NULL,                                                    -- 总分
    level VARCHAR(20),                                                     -- 结果分级（如“正常”“轻度焦虑”）
    report TEXT,                                                           -- 本次测评文字评价内容
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                -- 测评时间
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,               -- 外键：用户
    FOREIGN KEY (assessmentId) REFERENCES Assessment(id) ON DELETE CASCADE -- 外键：测评卷
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16、初始化用户类型和帖子类型
INSERT INTO UserType(name) VALUES ('admin'), ('user');                    -- 初始化用户类型
INSERT INTO PostType(name) VALUES ('学业压力'), ('情绪情感'), ('人际交往'), ('职业规划'), ('生活适应'), ('其他类型'); -- 初始化帖子类型
