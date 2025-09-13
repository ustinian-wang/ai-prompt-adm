#!/bin/bash

echo "开始初始化 WorkGroup 相关功能..."

# 创建 work_group 表
echo "1. 创建 work_group 表..."
node create-work-group-table.js

# 设置模型关联
echo "2. 设置模型关联..."
node setup-work-group-associations.js

echo "WorkGroup 初始化完成！"
echo ""
echo "可用的 API 端点："
echo "- POST /api/member/work_group/collect - 采集作品到分组"
echo "- POST /api/member/work_group/remove - 从分组中移除作品"
echo "- GET /api/member/work_group/group/:groupId/works - 获取分组下的作品列表"
echo "- GET /api/member/work_group/work/:workId/groups - 获取作品所在的分组列表"
echo "- GET /api/member/work_group/check/:workId/:groupId - 检查作品是否在指定分组中"
echo "- GET /api/member/work_group/member/works - 获取会员采集的所有作品"
echo "- POST /api/member/work_group/batch-collect - 批量采集作品到分组"
echo "- POST /api/member/work_group/batch-remove - 批量从分组中移除作品"
