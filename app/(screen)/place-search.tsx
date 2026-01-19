import { useState } from 'react';
import { FlatList } from 'react-native';
import Screen from '@/components/layout/screen';
import PlaceListItem from '@/components/place/place-list-item';
import SearchField from '@/components/ui/search-field';
import useSearchPlace from '@/hooks/queries/use-search-place';
import useDebounce from '@/hooks/use-debounce';

export default function PlaceSearch() {
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const { data: places, fetchNextPage, hasNextPage } = useSearchPlace(debouncedQuery);

  return (
    <Screen hasHeader>
      <SearchField
        value={query}
        placeholder="장소명으로 검색해주세요."
        autoFocus
        onChangeText={setQuery}
      />

      <FlatList
        data={places?.pages.flatMap((page) => page.places)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <PlaceListItem {...item} />}
      />
    </Screen>
  );
}
