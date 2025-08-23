-- MySQL初始化脚本
-- 在容器启动时自动执行

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `ai_prompt_admin`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `ai_prompt_admin`;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `user_phone` varchar(20) DEFAULT NULL COMMENT '手机号码',
  `user_avatar` varchar(255) DEFAULT 'https://via.placeholder.com/32x32/1890ff/ffffff?text=U',
  `user_role` enum('admin','sales','manager') DEFAULT 'sales' COMMENT '用户角色：admin-总后台管理员, sales-业务员, manager-客户经理',
  `user_status` enum('active','inactive') DEFAULT 'active' COMMENT '用户状态：active-正常, inactive-冻结',
  `user_created_at` bigint NOT NULL DEFAULT 0 COMMENT '创建时间戳（毫秒）',
  `user_updated_at` bigint NOT NULL DEFAULT 0 COMMENT '更新时间戳（毫秒）',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建分类表
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(100) NOT NULL COMMENT '分类名称',
  `description` text COMMENT '分类描述',
  `sort_order` int NOT NULL DEFAULT 1 COMMENT '排序权重，数字越小排序越靠前',
  `icon` varchar(100) DEFAULT NULL COMMENT '分类图标',
  `enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `show_in_nav` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否在导航中显示',
  `category_created_at` bigint NOT NULL DEFAULT 0 COMMENT '创建时间戳（毫秒）',
  `category_updated_at` bigint NOT NULL DEFAULT 0 COMMENT '更新时间戳（毫秒）',
  PRIMARY KEY (`category_id`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建作品表
CREATE TABLE IF NOT EXISTS `work` (
  `work_id` int NOT NULL AUTO_INCREMENT COMMENT '作品ID',
  `work_name` varchar(200) NOT NULL COMMENT '作品名称',
  `work_desc` text COMMENT '作品描述',
  `work_prompt_cn` text COMMENT '中文提示词',
  `work_prompt_en` text COMMENT '英文提示词',
  `work_guide_desc` longtext COMMENT '使用指南描述',
  `work_img_path` varchar(500) DEFAULT NULL COMMENT '作品图片路径',
  `user_id` int NOT NULL COMMENT '创建用户ID',
  `work_status` enum('draft','published','archived') DEFAULT 'draft' COMMENT '作品状态',
  `work_tag_list` json DEFAULT NULL COMMENT '标签列表',
  `work_outer_link_list` json DEFAULT NULL COMMENT '外部链接列表',
  `metadata` json DEFAULT NULL COMMENT '元数据',
  `work_created_at` bigint NOT NULL DEFAULT 0 COMMENT '创建时间戳（毫秒）',
  `work_updated_at` bigint NOT NULL DEFAULT 0 COMMENT '更新时间戳（毫秒）',
  PRIMARY KEY (`work_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_work_status` (`work_status`),
  KEY `idx_work_created_at` (`work_created_at`),
  CONSTRAINT `work_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认管理员用户（密码: admin123，使用SHA256加密）
INSERT IGNORE INTO `user` (`username`, `user_email`, `user_password`, `user_role`, `user_status`, `user_created_at`, `user_updated_at`) VALUES
('admin', 'admin@example.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin', 'active', UNIX_TIMESTAMP()*1000, UNIX_TIMESTAMP()*1000);

-- 插入默认分类
INSERT IGNORE INTO `category` (`name`, `description`, `sort_order`, `enabled`, `show_in_nav`, `category_created_at`, `category_updated_at`) VALUES
('默认分类', '系统默认分类', 1, 1, 1, UNIX_TIMESTAMP()*1000, UNIX_TIMESTAMP()*1000);

-- 显示创建的表
SHOW TABLES;

-- 显示用户表结构
DESCRIBE `user`;

-- 显示分类表结构
DESCRIBE `category`;

-- 显示作品表结构
DESCRIBE `work`;
