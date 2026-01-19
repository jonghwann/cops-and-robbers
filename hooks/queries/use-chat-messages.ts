import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getChatMessages } from '@/api/chat/api';
import type { ChatMessage, ChatMessagesCursor } from '@/api/chat/type';
import { queryKeys } from '@/lib/query-keys';
import { supabase } from '@/lib/supabase';

interface ChatMessagesPage {
  messages: ChatMessage[];
  nextCursor: ChatMessagesCursor | null;
  hasMore: boolean;
}

export default function useChatMessages(meetingId: string) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: queryKeys.chat.messages(meetingId),
    queryFn: ({ pageParam }) =>
      getChatMessages({
        meetingId,
        cursor: pageParam,
        limit: 30,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    initialPageParam: undefined as ChatMessagesCursor | undefined,
    enabled: !!meetingId,
  });

  useEffect(() => {
    if (!meetingId) return;

    const channel = supabase
      .channel(`chat:${meetingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `meeting_id=eq.${meetingId}`,
        },
        async (payload) => {
          const newMessage = payload.new as any;

          const { data: profile } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', newMessage.user_id)
            .single();

          const { data: session } = await supabase.auth.getSession();
          const currentUserId = session?.session?.user?.id;

          const message: ChatMessage = {
            id: newMessage.id,
            meetingId: newMessage.meeting_id,
            userId: newMessage.user_id,
            userName: profile?.name ?? '',
            userAvatarUrl: profile?.avatar_url ?? null,
            content: newMessage.content,
            createdAt: newMessage.created_at,
            isOwn: newMessage.user_id === currentUserId,
          };

          queryClient.setQueryData<{ pages: ChatMessagesPage[]; pageParams: any[] }>(
            queryKeys.chat.messages(meetingId),
            (old) => {
              if (!old) return old;

              const firstPage = old.pages[0];
              if (!firstPage) return old;

              const exists = firstPage.messages.some((m) => m.id === message.id);
              if (exists) return old;

              return {
                ...old,
                pages: [
                  {
                    ...firstPage,
                    messages: [message, ...firstPage.messages],
                  },
                  ...old.pages.slice(1),
                ],
              };
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId, queryClient]);

  return query;
}
