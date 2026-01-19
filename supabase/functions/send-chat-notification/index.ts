import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ChatMessage {
  id: string;
  meeting_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: ChatMessage;
  schema: string;
}

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();

    if (payload.type !== 'INSERT' || payload.table !== 'chat_messages') {
      return new Response('Not a chat message insert', { status: 200 });
    }

    const { meeting_id, user_id, content } = payload.record;

    // 발신자 정보 조회
    const { data: sender } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user_id)
      .single();

    // 모임 정보 조회
    const { data: meeting } = await supabase
      .from('meetings')
      .select('title')
      .eq('id', meeting_id)
      .single();

    // 모임 멤버들의 푸시 토큰 조회 (발신자 제외)
    const { data: members } = await supabase
      .from('meeting_members')
      .select('user_id')
      .eq('meeting_id', meeting_id)
      .neq('user_id', user_id);

    if (!members || members.length === 0) {
      return new Response('No members to notify', { status: 200 });
    }

    const memberIds = members.map((m) => m.user_id);

    const { data: tokens } = await supabase
      .from('push_tokens')
      .select('expo_push_token')
      .in('user_id', memberIds);

    if (!tokens || tokens.length === 0) {
      return new Response('No push tokens found', { status: 200 });
    }

    // Expo Push Notification 전송
    const pushTokens = tokens.map((t) => t.expo_push_token);

    const messages = pushTokens.map((token) => ({
      to: token,
      sound: 'default',
      title: meeting?.title ?? '새 메시지',
      body: `${sender?.name ?? '알 수 없음'}: ${content.slice(0, 100)}`,
      data: { meetingId: meeting_id },
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
