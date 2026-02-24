import { supabase } from '@/lib/supabase';

/**
 * Supabase Edge Function 호출 래퍼
 * 에러 발생 시 함수명과 함께 에러 컨텍스트를 제공합니다.
 */
export async function invokeFunction<T>(
  functionName: string,
  body?: object,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(functionName, {
    body: body ?? {},
  });
  if (error) {
    throw new Error(`[${functionName}] ${error.message ?? '알 수 없는 오류'}`);
  }
  if (data === null) {
    throw new Error(`[${functionName}] 응답 데이터가 없습니다`);
  }
  return data;
}

/**
 * Supabase RPC 호출 래퍼
 * 에러 발생 시 RPC명과 함께 에러 컨텍스트를 제공합니다.
 */
export async function invokeRpc<T>(
  rpcName: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.rpc(rpcName, params);
  if (error) {
    throw new Error(`[${rpcName}] ${error.message ?? '알 수 없는 오류'}`);
  }
  return data;
}
