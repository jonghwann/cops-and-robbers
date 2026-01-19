export const queryKeys = {
  profile: {
    all: ['profile'],
  },
  search: {
    address: (query: string) => ['search', 'address', query],
    place: (query: string) => ['search', 'place', query],
  },
  meetings: {
    all: ['meetings'],
    list: (region2: string) => ['meetings', 'list', region2],
    my: ['meetings', 'my'],
    saved: ['meetings', 'saved'],
    byId: (meetingId: string) => ['meetings', 'byId', meetingId],
    schedules: (meetingId: string) => ['meetings', 'schedules', meetingId],
    members: (meetingId: string) => ['meetings', 'members', meetingId],
  },
};
