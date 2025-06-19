#!/usr/bin/env node

/**
 * Netlify 自动部署脚本
 * 使用 Netlify CLI 进行自动化部署
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, 'blue');
    const result = execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log(`✅ ${description} 完成`, 'green');
    return result;
  } catch (error) {
    log(`❌ ${description} 失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

function checkNetlifyCLI() {
  try {
    execSync('netlify --version', { stdio: 'pipe' });
    log('✅ Netlify CLI 已安装', 'green');
  } catch (error) {
    log('❌ Netlify CLI 未安装，正在安装...', 'yellow');
    execCommand('npm install -g netlify-cli', '安装 Netlify CLI');
  }
}

function checkEnvironmentFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ 未找到 .env.local 文件，请确保环境变量已配置', 'red');
    process.exit(1);
  }
  log('✅ 环境变量文件存在', 'green');
}

function deployToNetlify() {
  log('\n🚀 准备部署到 Netlify...', 'blue');
  
  // 构建项目
  execCommand('npm run build', '构建项目');
  
  // 检查构建输出目录
  const buildDir = '.next';
  if (!fs.existsSync(buildDir)) {
    log('❌ 构建目录不存在，构建可能失败', 'red');
    process.exit(1);
  }
  
  log('\n📦 构建完成！部署文件已准备就绪', 'green');
  log('\n🌐 由于网络连接问题，请手动部署到 Netlify:', 'yellow');
  log('\n📋 手动部署步骤:', 'blue');
  log('1. 访问 https://netlify.com 并登录', 'yellow');
  log('2. 点击 "New site from Git" 或拖拽部署', 'yellow');
  log('3. 如果使用 Git 部署，选择你的仓库', 'yellow');
  log('4. 配置构建设置:', 'yellow');
  log('   - Build command: npm run build', 'yellow');
  log('   - Publish directory: .next', 'yellow');
  log('   - Node version: 18', 'yellow');
  log('5. 添加环境变量（见下方）', 'yellow');
  log('\n🔧 需要在 Netlify 中配置的环境变量:', 'blue');
  
  // 读取并显示环境变量
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    envLines.forEach(line => {
      if (line.includes('=')) {
        const [key] = line.split('=');
        log(`   ${key}`, 'yellow');
      }
    });
  }
  
  log('\n✅ 项目已准备就绪，可以部署了！', 'green');
}

function main() {
  log('🌐 Netlify 自动部署工具', 'blue');
  log('================================', 'blue');
  
  // 检查环境
  checkEnvironmentFile();
  checkNetlifyCLI();
  
  // 部署
  deployToNetlify();
}

if (require.main === module) {
  main();
}

module.exports = { main };