import { useState } from 'react';
import { FlatList } from 'react-native';
import AddressListItem from '@/components/address/address-list-item';
import Screen from '@/components/layout/screen';
import Input from '@/components/ui/input';
import { useSearchAddress } from '@/hooks/queries/use-search-address';
import useDebounce from '@/hooks/use-debounce';

export default function AddressSearch() {
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const { data: addresses } = useSearchAddress(debouncedQuery);

  return (
    <Screen hasHeader>
      <Input
        value={query}
        placeholder="동·읍·면을 입력해주세요."
        autoFocus
        icon={{ size: 18 }}
        onChangeText={setQuery}
        className="h-12 rounded-full bg-[#f3f4f6]"
        inputClassName="text-lg leading-6"
      />
      <FlatList
        data={addresses}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <AddressListItem {...item} />}
      />
    </Screen>
  );
}
