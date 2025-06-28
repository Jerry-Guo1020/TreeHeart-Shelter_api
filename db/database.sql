-- 创建数据库
CREATE DATABASE IF NOT EXISTS Tree DEFAULT CHARACTER SET 'utf8mb4';
USE Tree;

-- 1、用户类型表，区分普通用户和管理员(但是前端不弄管理员管理，目前主要的作用是管理员发布活动内容通过数据库直接插入实现)
CREATE TABLE UserType (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  --用户类型id
    name VARCHAR(30) NOT NULL UNIQUE,                                      --用户类型名称
    INDEX idx_name (name)                                                  --索引功能
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2、用户表(微信openid作为唯一标识，包含初始信息和后序完善的信息)
CREATE TABLE User (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                                   --用户id
    userTypeId BIGINT NOT NULL,                                                             --用户类型的id
    openid VARCHAR(255) NOT NULL UNIQUE,                                                    --微信openid
    nickname VARCHAR(50) NOT NULL,                                                          --用户昵称
    avatar VARCHAR(255) NOT NULL,                                                           --用户头像
    username VARCHAR(30),                                                                   --用户名
    sex ENUM('男', '女'),                                                                   --性别
    grade ENUM('大一', '大二', '大三', '大四'),                                              --年级设置
    college VARCHAR(50),                                                                    --大学名字
    subCollege VARCHAR(50),                                                                 --学院
    major VARCHAR(50),                                                                      --专业名称
    isNewUser TINYINT(1) NOT NULL DEFAULT 1,                                                --是否为新用户
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                                 --注册时间
    updateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,              --更新时间
    INDEX idx_openid (openid),
    FOREIGN KEY (userTypeId) REFERENCES UserType(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3、关注表（遇到的问题：followerId有两个喔 ——其实这个是被关注者和关注者的多对多的常用关系的设计，这样也同时可以说就是一个人可以被很多人关注，也可以关注很多人）
CREATE TABLE UserFollow (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                                   --关注记录的id
    followerId BIGINT NOT NULL,                                                             --关注者用户的id
    followedId BIGINT NOT NULL,                                                             --被关注者用户id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                                 --关注时间
    INDEX idx_followerId (followerId),                                                      --索引
    INDEX idx_followedId (followedId),                                                      --索引
    FOREIGN KEY (followerId) REFERENCES User(id) ON DELETE CASCADE,                         --外键
    FOREIGN KEY (followedId) REFERENCES User(id) ON DELETE CASCADE                          --外键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4、帖子类型表
CREATE TABLE PostType (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                                   --类型id
    name VARCHAR(30) NOT NULL,                                                              --类型名称
    INDEX idx_name (name)                                                                   --索引
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5、帖子照片表（这个用于就是我的动态里面上传照片用的，一个照片上传动态分有：待上传【一般是编辑了动态但是没有发送】、上传中、上传完成）
CREATE TABLE PostImg (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                                              --图片id
    browser VARCHAR(100) NOT NULL,                                                     --存储桶名
    uri VARCHAR(100),                                                                  --图片url
    status ENUM('待上传', '上传中', '已完成') NOT NULL DEFAULT '待上传',                 --图片上传状态
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                            --创建时间
    INDEX idx_status (status)                                                          --索引功能
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6、帖子表
CREATE TABLE Post (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                   --帖子的id
    uid BIGINT NOT NULL,                                                    --用户id
    typeId BIGINT NOT NULL,                                                 --帖子类id
    title VARCHAR(100) NOT NULL,                                            --帖子的标题
    content TEXT NOT NULL,                                                  --帖子的内容
    imgId BIGINT,                                                           --配图id
    likeCount INT DEFAULT 0,                                                --点赞数
    commentCount INT DEFAULT 0,                                             --评论数
    collectCount INT DEFAULT 0,                                             --收藏数
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                 --发布的时间
    INDEX idx_uid (uid),                                                    --索引功能
    INDEX idx_typeId (typeId),
    INDEX idx_imgId (imgId),
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,                -- uid 从 user表 id 外键
    FOREIGN KEY (typeId) REFERENCES PostType(id) ON DELETE CASCADE,         -- typeId 从 PostType表 id 外键
    FOREIGN KEY (imgId) REFERENCES PostImg(id) ON DELETE CASCADE            -- imgId 从 PostImg表 id 外键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7、点赞表
CREATE TABLE PostLike (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                   --点赞id
    uid BIGINT NOT NULL,                                                    --用户id
    postId BIGINT NOT NULL,                                                 --帖子id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                 --创建时间                    
    INDEX idx_uid (uid),                                                    --索引                             
    INDEX idx_postId (postId),                                              --索引                                 
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,                --外键
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE              --外键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8、评论表
CREATE TABLE PostComment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                   --评论id
    uid BIGINT NOT NULL,                                                    --用户id
    postId BIGINT NOT NULL,                                                 --帖子id
    content VARCHAR(255) NOT NULL,                                          --评论内容
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                 --评论时间
    INDEX idx_uid (uid),
    INDEX idx_postId (postId),
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9、收藏表
CREATE TABLE PostCollect (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,                                  --收藏id
    uid BIGINT NOT NULL,                                                   --用户id
    postId BIGINT NOT NULL,                                                --帖子id
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,                --创建时间
    INDEX idx_uid (uid),
    INDEX idx_postId (postId),
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10、活动表
CREATE TABLE Activity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uid BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    imgId BIGINT,
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uid (uid),
    INDEX idx_imgId (imgId),
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (imgId) REFERENCES PostImg(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11、活动报名表
CREATE TABLE ActivityJoin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uid BIGINT NOT NULL,
    activityId BIGINT NOT NULL,
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uid (uid),
    INDEX idx_activityId (activityId),
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (activityId) REFERENCES Activity(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12、心理测评表
CREATE TABLE Assessment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13、测评题目表
CREATE TABLE AssessmentQuestion (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assessmentId BIGINT NOT NULL,
    questionType ENUM('单选', '多选', '简答') NOT NULL,
    content TEXT NOT NULL,
    options JSON,
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessmentId) REFERENCES Assessment(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14、测评标准答案表
CREATE TABLE AssessmentAnswer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    questionId BIGINT NOT NULL,
    answer TEXT,
    FOREIGN KEY (questionId) REFERENCES AssessmentQuestion(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15、用户测评记录表
CREATE TABLE UserAssessmentRecord (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    uid BIGINT NOT NULL,
    assessmentId BIGINT NOT NULL,
    score INT,
    report TEXT,
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (assessmentId) REFERENCES Assessment(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16、用户答题明细表
CREATE TABLE UserAssessmentAnswer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    recordId BIGINT NOT NULL,
    questionId BIGINT NOT NULL,
    answer TEXT,
    FOREIGN KEY (recordId) REFERENCES UserAssessmentRecord(id) ON DELETE CASCADE,
    FOREIGN KEY (questionId) REFERENCES AssessmentQuestion(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17、初始化用户类型和帖子类型
INSERT INTO UserType(name) VALUES ('admin'), ('user');
INSERT INTO PostType(name) VALUES ('学业压力'), ('情绪情感'), ('人际交往'), ('职业规划'), ('生活适应'), ('其他类型');





