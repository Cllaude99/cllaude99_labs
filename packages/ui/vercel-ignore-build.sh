#!/bin/bash

# Vercel의 자동 빌드 스킵 조건
# packages/ui/에 변경사항이 있으면 빌드 진행 (Storybook 배포)

echo "🔍 Checking for changes in UI package..."

# 현재 디렉토리(packages/ui/)의 변경사항 확인
if git diff HEAD^ HEAD --quiet .; then
  echo "⏭️  No changes in UI package - skipping build"
  exit 0  # 빌드 스킵
else
  echo "✅ Changes detected in UI package - proceeding with Storybook build"
  exit 1  # 빌드 진행
fi
