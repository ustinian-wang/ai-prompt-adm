#!/bin/bash
# 脚本名：gemini_review_staged.sh

# 获取暂存区文件列表
files=$(git diff --name-only --staged)

if [ -z "$files" ]; then
  echo "没有暂存的文件。"
  exit 0
fi

for file in $files; do
  echo "=== Reviewing file: $file ==="
  # 读取暂存区文件内容
  content=$(git show :$file)
  
  # 调用 Gemini CLI review
  gemini -p "请 review 文件 $file 内容如下：$content"

  echo ""
done