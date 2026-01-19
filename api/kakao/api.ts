import type { KakaoPlaceDocument, Place, SearchPlaceResponse } from './type';

export async function searchAddress(query: string) {
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}&size=30`;

  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}` },
  });

  if (!response.ok) {
    throw new Error();
  }

  const result = await response.json();

  return (result.documents as any[])
    .map((document) => document.address)
    .filter((address) => address?.region_3depth_h_name)
    .map((address) => ({
      region1: address.region_1depth_name,
      region2: address.region_2depth_name,
      region3: address.region_3depth_h_name,
      hCode: address.h_code,
    }));
}

export async function searchPlace(query: string, page = 1): Promise<SearchPlaceResponse> {
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15&page=${page}`;

  const response = await fetch(url, {
    headers: { Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}` },
  });

  if (!response.ok) {
    throw new Error();
  }

  const result = await response.json();

  return {
    places: (result.documents as KakaoPlaceDocument[]).map((doc) => ({
      id: doc.id,
      name: doc.place_name,
      address: doc.road_address_name || doc.address_name,
      url: doc.place_url,
    })),
    isEnd: result.meta.is_end,
  };
}
