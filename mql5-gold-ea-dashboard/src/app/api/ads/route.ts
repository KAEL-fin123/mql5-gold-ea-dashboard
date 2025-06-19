import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase';

// 创建Supabase客户端
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET() {
  try {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取广告数据错误:', error);
      return NextResponse.json(
        { error: '获取广告数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      total: data?.length || 0
    });

  } catch (error) {
    console.error('广告API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}