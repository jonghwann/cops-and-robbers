import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Place } from '@/api/kakao/type';

const initialState = {
  place: null as Place | null,
};

export const usePlaceStore = create(
  immer(
    combine(initialState, (set) => ({
      actions: {
        setPlace: (place: Place) => {
          set((state) => {
            state.place = place;
          });
        },
        clearPlace: () => {
          set((state) => {
            state.place = null;
          });
        },
      },
    })),
  ),
);

export const usePlace = () => {
  return usePlaceStore((store) => store.place);
};

export const useSetPlace = () => {
  return usePlaceStore((state) => state.actions.setPlace);
};

export const useClearPlace = () => {
  return usePlaceStore((state) => state.actions.clearPlace);
};
