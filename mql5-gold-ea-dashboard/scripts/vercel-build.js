#!/usr/bin/env node

/**
 * Vercel强制构建脚本
 * 解决Babel/SWC冲突和模块解析问题
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始强制Vercel构建过程...');

// 1. 强制删除所有可能的Babel配置文件
console.log('🗑️ 清除所有Babel配置文件...');
const babelFiles = [
  '.babelrc',
  '.babelrc.js',
  '.babelrc.json',
  'babel.config.js',
  'babel.config.json'
];

babelFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`🗑️ 删除了 ${file}`);
  }
});

// 2. 检查关键文件是否存在
const criticalFiles = [
  'src/components/EACard.tsx',
  'src/lib/supabase.ts',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/api/eas/route.ts'
];

console.log('📋 检查关键文件...');
criticalFiles.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} 存在 (${fullPath})`);
  } else {
    console.error(`❌ ${file} 不存在 (${fullPath})`);
    process.exit(1);
  }
});

// 3. 验证路径别名配置
console.log('🔧 验证路径别名配置...');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@/*']) {
  console.log('✅ TypeScript路径别名配置正确:', tsconfig.compilerOptions.paths['@/*']);
} else {
  console.error('❌ TypeScript路径别名配置缺失');
  process.exit(1);
}

// 4. 彻底清理构建缓存
console.log('🧹 彻底清理构建缓存...');
const cleanupPaths = ['.next', 'out', 'node_modules/.cache', '.vercel'];
cleanupPaths.forEach(cleanPath => {
  try {
    if (fs.existsSync(cleanPath)) {
      execSync(`rm -rf ${cleanPath}`, { stdio: 'inherit' });
      console.log(`🧹 清理了 ${cleanPath}`);
    }
  } catch (error) {
    console.log(`⚠️ 清理 ${cleanPath} 时出现警告:`, error.message);
  }
});

// 5. 设置强制SWC环境变量
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_BABEL = 'true';
process.env.FORCE_SWC = 'true';

console.log('🔧 设置环境变量强制使用SWC...');
console.log('   NEXT_TELEMETRY_DISABLED=1');
console.log('   DISABLE_BABEL=true');
console.log('   FORCE_SWC=true');

// 6. 运行Next.js构建
console.log('🏗️ 运行Next.js构建...');
try {
  execSync('next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      DISABLE_BABEL: 'true',
      FORCE_SWC: 'true'
    }
  });
  console.log('✅ Next.js构建成功');
} catch (error) {
  console.error('❌ Next.js构建失败:', error.message);
  console.error('构建环境信息:');
  console.error('- Node.js版本:', process.version);
  console.error('- 工作目录:', process.cwd());
  console.error('- 环境变量:', Object.keys(process.env).filter(key => key.includes('NEXT') || key.includes('BABEL')));
  process.exit(1);
}

console.log('🎉 强制Vercel构建完成！');
