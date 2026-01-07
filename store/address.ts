import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  address: { region1: '', region2: '', region3: '', hCode: '' },
};

export const useAddressStore = create(
  immer(
    combine(initialState, (set) => ({
      actions: {
        setAddress: (address: typeof initialState.address) => {
          set((state) => {
            Object.assign(state.address, address);
          });
        },
      },
    })),
  ),
);

export const useAddress = () => {
  const address = useAddressStore((store) => store.address);
  return address;
};

export const useSetAddress = () => {
  const setAddress = useAddressStore((state) => state.actions.setAddress);
  return setAddress;
};
