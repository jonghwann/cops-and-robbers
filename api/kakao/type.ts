export interface Place {
  id: string;
  name: string;
  address: string;
  url: string;
}

export interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  place_url: string;
}

export interface SearchPlaceResponse {
  places: Place[];
  isEnd: boolean;
}
