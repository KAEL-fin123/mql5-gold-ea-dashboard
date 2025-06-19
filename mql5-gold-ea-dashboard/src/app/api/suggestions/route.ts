import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase';
import { createIssueForSuggestion } from '../../../lib/mcp-client';

// 创建Supabase客户端
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// 获取客户端IP地址
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (remoteAddr) {
    return remoteAddr;
  }
  
  return 'unknown';
}

// IP限制检查
async function checkIPLimit(ip: string, supabase: any): Promise<boolean> {
  try {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const { data, error } = await supabase
      .from('user_requests')
      .select('id')
      .eq('ip_address', ip)
      .gte('submitted_at', oneHourAgo.toISOString())
      .limit(5);

    if (error) {
      console.error('IP限制检查错误:', error);
      return false;
    }

    return (data?.length || 0) < 5;
  } catch (error) {
    console.error('IP限制检查异常:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: '服务配置错误' },
        { status: 500 }
      );
    }

    // 解析请求数据
    const data = await request.json();
    
    // 验证必需字段
    if (!data.ea_name || !data.reason) {
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      );
    }

    // 获取客户端IP
    const clientIP = getClientIP(request);
    
    // 创建Supabase客户端
    const supabase = createSupabaseClient();
    
    // 检查IP限制
    const canSubmit = await checkIPLimit(clientIP, supabase);
    if (!canSubmit) {
      return NextResponse.json(
        { error: '提交过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 插入建议到数据库
    const { data: insertData, error: insertError } = await supabase
      .from('user_requests')
      .insert({
        ea_name: data.ea_name,
        reason: data.reason,
        contact: data.contact || null,
        ip_address: clientIP,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('插入建议失败:', insertError);
      return NextResponse.json(
        { error: '提交失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 尝试创建GitHub Issue（可选）
    try {
      await createIssueForSuggestion({
        ea_name: data.ea_name,
        reason: data.reason,
        contact: data.contact
      });
    } catch (githubError) {
      console.error('创建GitHub Issue失败:', githubError);
      // 不影响主要功能，继续执行
    }

    return NextResponse.json({
      success: true,
      message: '建议提交成功！感谢您的反馈。',
      data: insertData
    });

  } catch (error) {
    console.error('建议提交API错误:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: '服务配置错误' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('admin_key');

    // 验证管理员权限
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      );
    }

    const supabase = createSupabaseClient();

    // 获取建议统计
    const { data, error } = await supabase
      .from('user_requests')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('获取建议失败:', error);
      return NextResponse.json(
        { error: '获取建议失败' },
        { status: 500 }
      );
    }

    // 统计信息
    const stats = {
      total: data?.length || 0,
      today: data?.filter(item => {
        const today = new Date().toDateString();
        const itemDate = new Date(item.submitted_at).toDateString();
        return today === itemDate;
      }).length || 0,
      thisWeek: data?.filter(item => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(item.submitted_at) > weekAgo;
      }).length || 0
    };

    return NextResponse.json({
      success: true,
      suggestions: data,
      stats
    });

  } catch (error) {
    console.error('获取建议统计失败:', error);
    return NextResponse.json(
      { error: '获取统计信息失败' },
      { status: 500 }
    );
  }
}
