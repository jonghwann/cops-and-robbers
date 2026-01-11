export const queryKeys = {
  profile: {
    all: ['profile'],
    // list: ['profile', 'list'],
    // byId: (id: string) => ['profile', 'byId', id],
  },
  search: {
    address: (query: string) => ['search', 'address', query],
  },
};
