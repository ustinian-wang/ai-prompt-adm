-- 会员账号表（简化版）
CREATE TABLE `member_accounts` (
  `mem_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  `mem_username` varchar(50) NOT NULL COMMENT '会员用户名',
  `mem_password` varchar(100) NOT NULL COMMENT '密码',
  `mem_nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `mem_avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `mem_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '账号状态：1-正常，0-禁用',
  `mem_level` tinyint(2) NOT NULL DEFAULT '1' COMMENT '会员等级：1-普通会员，2-VIP会员',
  `mem_last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `mem_register_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`mem_id`),
  UNIQUE KEY `uk_mem_username` (`mem_username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员账号表';
