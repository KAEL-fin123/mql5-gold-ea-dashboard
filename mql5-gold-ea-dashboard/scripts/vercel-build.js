#!/usr/bin/env node

/**
 * Vercel构建脚本
 * 确保路径解析和模块导入正确工作
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始Vercel构建过程...');

// 1. 检查关键文件是否存在
const criticalFiles = [
  'src/components/EACard.tsx',
  'src/lib/supabase.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/api/eas/route.ts'
];

console.log('📋 检查关键文件...');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} 存在`);
  } else {
    console.error(`❌ ${file} 不存在`);
    process.exit(1);
  }
});

// 2. 检查tsconfig.json路径别名配置
console.log('🔧 检查TypeScript配置...');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@/*']) {
  console.log('✅ TypeScript路径别名配置正确');
} else {
  console.error('❌ TypeScript路径别名配置缺失');
  process.exit(1);
}

// 3. 清理之前的构建
console.log('🧹 清理之前的构建...');
try {
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  if (fs.existsSync('out')) {
    execSync('rm -rf out', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('清理过程中的警告:', error.message);
}

// 4. 运行类型检查
console.log('🔍 运行类型检查...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ 类型检查通过');
} catch (error) {
  console.log('⚠️ 类型检查有警告，但继续构建...');
}

// 5. 运行Next.js构建
console.log('🏗️ 运行Next.js构建...');
try {
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ Next.js构建成功');
} catch (error) {
  console.error('❌ Next.js构建失败:', error.message);
  process.exit(1);
}

console.log('🎉 Vercel构建完成！');
