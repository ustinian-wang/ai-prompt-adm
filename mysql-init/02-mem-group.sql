-- mem_group 表：会员自定义分组
-- 约定：所有字段以 mg_ 前缀

CREATE TABLE IF NOT EXISTS `mem_group` (
  `mg_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '分组ID',
  `mg_mem_id` bigint(20) NOT NULL COMMENT '所属会员ID，关联 member_accounts.mem_id',
  `mg_name` varchar(50) NOT NULL COMMENT '分组名称，同一会员下唯一',
  `mg_desc` varchar(255) DEFAULT NULL COMMENT '分组描述',
  `mg_is_private` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否私有：1-私有 0-公开',
  `mg_sort_order` int(11) NOT NULL DEFAULT '0' COMMENT '排序值，越大越前',
  `mg_cover_url` varchar(255) DEFAULT NULL COMMENT '封面URL',
  `mg_color` varchar(32) DEFAULT NULL COMMENT '分组颜色',
  `mg_item_count` int(11) NOT NULL DEFAULT '0' COMMENT '条目数量（冗余统计）',
  `mg_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `mg_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `mg_deleted_at` datetime DEFAULT NULL COMMENT '软删除时间',
  PRIMARY KEY (`mg_id`),
  KEY `idx_mg_mem_id` (`mg_mem_id`),
  KEY `idx_mg_mem_sort` (`mg_mem_id`, `mg_sort_order`),
  UNIQUE KEY `uk_mg_name_per_member` (`mg_mem_id`, `mg_name`),
  CONSTRAINT `fk_mem_group_member` FOREIGN KEY (`mg_mem_id`) REFERENCES `member_accounts` (`mem_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员分组表';


