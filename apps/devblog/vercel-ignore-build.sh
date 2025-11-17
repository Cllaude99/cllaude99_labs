#!/bin/bash

# Vercel의 자동 빌드 스킵 조건
# apps/devblog/에 변경사항이 있으면 빌드 진행

echo "🔍 Checking for changes in devblog..."

# 현재 디렉토리(apps/devblog/)의 변경사항 확인
if git diff HEAD^ HEAD --quiet .; then
  echo "⏭️  No changes in devblog - skipping build"
  exit 0  # 빌드 스킵
else
  echo "✅ Changes detected in devblog - proceeding with build"
  exit 1  # 빌드 진행
fi
