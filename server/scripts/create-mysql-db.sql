-- 创建数据库
CREATE DATABASE IF NOT EXISTS `ai_prompt_admin` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `ai_prompt_admin`;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'user',
  `status` tinyint(1) DEFAULT 1,
  `created_at` bigint DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建作品表
CREATE TABLE IF NOT EXISTS `work` (
  `id` varchar(36) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` longtext,
  `category_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  `status` varchar(20) DEFAULT 'draft',
  `created_at` bigint DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建分类表
CREATE TABLE IF NOT EXISTS `category` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `parent_id` varchar(36) DEFAULT NULL,
  `sort_order` int DEFAULT 0,
  `status` tinyint(1) DEFAULT 1,
  `created_at` bigint DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认管理员用户（密码: admin123）
INSERT INTO `user` (`id`, `username`, `password`, `email`, `role`, `status`, `created_at`, `updated_at`) VALUES
('admin-001', 'admin', '$2a$10$rQZ8K9LmN2P1O3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N', 'admin@example.com', 'admin', 1, UNIX_TIMESTAMP()*1000, UNIX_TIMESTAMP()*1000);

-- 插入默认分类
INSERT INTO `category` (`id`, `name`, `description`, `parent_id`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
('cat-001', '默认分类', '系统默认分类', NULL, 1, 1, UNIX_TIMESTAMP()*1000, UNIX_TIMESTAMP()*1000);
