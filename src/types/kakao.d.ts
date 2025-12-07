declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: {
          center: kakao.maps.LatLng
          level: number
        }) => kakao.maps.Map

        LatLng: new (lat: number, lng: number) => kakao.maps.LatLng

        LatLngBounds: new () => kakao.maps.LatLngBounds

        Marker: new (options: {
          position: kakao.maps.LatLng
          map?: kakao.maps.Map
          image?: kakao.maps.MarkerImage
          title?: string
        }) => kakao.maps.Marker

        MarkerImage: new (
          src: string,
          size: kakao.maps.Size,
          options?: { offset?: kakao.maps.Point }
        ) => kakao.maps.MarkerImage

        Size: new (width: number, height: number) => kakao.maps.Size

        Point: new (x: number, y: number) => kakao.maps.Point

        CustomOverlay: new (options: {
          position: kakao.maps.LatLng
          content: HTMLElement | string
          yAnchor?: number
        }) => kakao.maps.CustomOverlay

        load: (callback: () => void) => void        
        services: {
          Geocoder: new () => kakao.maps.services.Geocoder
          Places: new () => kakao.maps.services.Places
          Status: {
            OK: string
            ZERO_RESULT: string
            ERROR: string
          }
        }

        event: {
          addListener: (
            target: kakao.maps.Map | kakao.maps.Marker,
            type: string,
            handler: (mouseEvent: kakao.maps.event.MouseEvent) => void
          ) => void
        }
      }
    }
  }

  namespace kakao.maps {
    interface Map {
      setCenter(latlng: LatLng): void
      getCenter(): LatLng
      setLevel(level: number): void
      setBounds(bounds: LatLngBounds): void
    }

    interface LatLng {
      getLat(): number
      getLng(): number
    }

    interface LatLngBounds {
      extend(latlng: LatLng): void
      getSouthWest(): LatLng
      getNorthEast(): LatLng
    }

    interface Marker {
      setMap(map: Map | null): void
      setPosition(position: LatLng): void
      getPosition(): LatLng
    }

    interface MarkerImage {}

    interface Size {
      width: number
      height: number
    }

    interface Point {
      x: number
      y: number
    }

    interface CustomOverlay {
      setMap(map: Map | null): void
      setPosition(position: LatLng): void
    }

    namespace services {
      interface Geocoder {
        addressSearch(
          address: string,
          callback: (result: AddressSearchResult[], status: string) => void
        ): void

        coord2Address(
          lng: number,
          lat: number,
          callback: (result: Coord2AddressResult[], status: string) => void
        ): void
      }

      interface AddressSearchResult {
        address_name: string
        x: string
        y: string
        address_type: string
        address: {
          address_name: string
          region_1depth_name: string
          region_2depth_name: string
          region_3depth_name: string
        }
        road_address: {
          address_name: string
          region_1depth_name: string
          region_2depth_name: string
          region_3depth_name: string
        } | null
      }      interface Coord2AddressResult {
        address: {
          address_name: string
          region_1depth_name: string
          region_2depth_name: string
          region_3depth_name: string
        }
        road_address: {
          address_name: string
          region_1depth_name: string
          region_2depth_name: string
          region_3depth_name: string
        } | null
      }

      interface Places {
        keywordSearch(
          keyword: string,
          callback: (result: PlaceSearchResult[], status: string) => void
        ): void
      }

      interface PlaceSearchResult {
        place_name: string
        address_name: string
        road_address_name: string
        x: string
        y: string
        id: string
        category_name: string
        phone: string
        place_url: string
      }
    }

    namespace event {
      interface MouseEvent {
        latLng: LatLng
      }
    }
  }
}

export {}
