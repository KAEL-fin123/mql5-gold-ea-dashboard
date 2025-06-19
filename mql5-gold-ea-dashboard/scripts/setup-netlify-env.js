#!/usr/bin/env node

/**
 * Netlify 环境变量设置脚本
 * 自动从 .env.local 读取并设置到 Netlify
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

function parseEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ 未找到 .env.local 文件', 'red');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

function setNetlifyEnvVar(key, value) {
  try {
    // 转义特殊字符
    const escapedValue = value.replace(/"/g, '\\"');
    const command = `netlify env:set ${key} "${escapedValue}"`;
    
    execSync(command, { stdio: 'pipe' });
    log(`✅ 设置环境变量: ${key}`, 'green');
  } catch (error) {
    log(`❌ 设置环境变量失败: ${key} - ${error.message}`, 'red');
  }
}

function setupNetlifyEnvironment() {
  log('🔧 设置 Netlify 环境变量...', 'blue');
  
  // 检查是否已登录 Netlify
  try {
    execSync('netlify status', { stdio: 'pipe' });
  } catch (error) {
    log('❌ 请先登录 Netlify: netlify login', 'red');
    process.exit(1);
  }
  
  const envVars = parseEnvFile();
  
  // 需要设置的环境变量
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_SECRET_KEY',
    'GITHUB_PERSONAL_ACCESS_TOKEN',
    'GITHUB_OWNER',
    'GITHUB_REPO',
    'GITHUB_BRANCH'
  ];
  
  log(`\n📋 发现 ${Object.keys(envVars).length} 个环境变量`, 'blue');
  
  requiredVars.forEach(varName => {
    if (envVars[varName]) {
      setNetlifyEnvVar(varName, envVars[varName]);
    } else {
      log(`⚠️  未找到环境变量: ${varName}`, 'yellow');
    }
  });
  
  log('\n✅ 环境变量设置完成！', 'green');
  log('\n📝 你可以通过以下命令查看设置的环境变量:', 'blue');
  log('   netlify env:list', 'yellow');
}

function main() {
  log('🌐 Netlify 环境变量设置工具', 'blue');
  log('================================', 'blue');
  
  setupNetlifyEnvironment();
}

if (require.main === module) {
  main();
}

module.exports = { main, parseEnvFile, setNetlifyEnvVar };