export const queryKeys = {
  profile: {
    all: ['profile'],
  },
  search: {
    address: (query: string) => ['search', 'address', query],
  },
  meetings: {
    all: ['meetings'],
    list: (region2: string) => ['meetings', 'list', region2],
    my: ['meetings', 'my'],
    saved: ['meetings', 'saved'],
    byId: (meetingId: string) => ['meetings', 'byId', meetingId],
  },
};
