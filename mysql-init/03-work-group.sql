-- work_group 表：作品分组关联表
-- 约定：所有字段以 wg_ 前缀

CREATE TABLE IF NOT EXISTS `work_group` (
  `wg_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `wg_work_id` int(11) NOT NULL COMMENT '作品ID，关联 work.work_id',
  `wg_mg_id` bigint(20) NOT NULL COMMENT '分组ID，关联 mem_group.mg_id',
  `wg_mem_id` bigint(20) NOT NULL COMMENT '会员ID，关联 member_accounts.mem_id（冗余字段，便于查询）',
  `wg_collected_at` bigint(20) NOT NULL DEFAULT '0' COMMENT '采集时间戳（毫秒）',
  `wg_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `wg_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `wg_deleted_at` datetime DEFAULT NULL COMMENT '软删除时间',
  PRIMARY KEY (`wg_id`),
  UNIQUE KEY `uk_work_group` (`wg_work_id`, `wg_mg_id`),
  KEY `idx_wg_work_id` (`wg_work_id`),
  KEY `idx_wg_mg_id` (`wg_mg_id`),
  KEY `idx_wg_mem_id` (`wg_mem_id`),
  KEY `idx_wg_collected_at` (`wg_collected_at`),
  -- 暂时注释外键约束，避免创建表时出错
  -- CONSTRAINT `fk_work_group_work` FOREIGN KEY (`wg_work_id`) REFERENCES `work` (`work_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  -- CONSTRAINT `fk_work_group_mem_group` FOREIGN KEY (`wg_mg_id`) REFERENCES `mem_group` (`mg_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  -- CONSTRAINT `fk_work_group_member` FOREIGN KEY (`wg_mem_id`) REFERENCES `member_accounts` (`mem_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='作品分组关联表';
