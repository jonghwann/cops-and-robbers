export const BACK_SCREEN_OPTIONS = {
  headerShown: true,
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal' as const,
};

export const BACK_SCREENS = [
  { name: '(screen)/address-search', options: { title: '주소 검색' } },
  { name: '(screen)/meetings/create', options: { title: '모임 개설' } },
  { name: '(screen)/meetings/edit/[id]', options: { title: '모임 수정' } },
];
