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
