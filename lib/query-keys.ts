export const queryKeys = {
  profile: {
    all: ['profile'],
  },
  search: {
    address: (query: string) => ['search', 'address', query],
  },
  meetings: {
    all: ['meetings'],
    list: ['meetings', 'list'],
    byId: (meetingId: string) => ['meetings', 'byId', meetingId],
  },
};
