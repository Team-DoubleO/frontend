declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: {
          center: kakao.maps.LatLng
          level: number
        }) => kakao.maps.Map
        
        LatLng: new (lat: number, lng: number) => kakao.maps.LatLng
        
        Marker: new (options: {
          position: kakao.maps.LatLng
          map?: kakao.maps.Map
        }) => kakao.maps.Marker
        
        CustomOverlay: new (options: {
          position: kakao.maps.LatLng
          content: HTMLElement | string
          yAnchor?: number
        }) => kakao.maps.CustomOverlay
        
        load: (callback: () => void) => void
        
        services: {
          Geocoder: new () => kakao.maps.services.Geocoder
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
    }
    
    interface LatLng {
      getLat(): number
      getLng(): number
    }
    
    interface Marker {
      setMap(map: Map | null): void
      setPosition(position: LatLng): void
      getPosition(): LatLng
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
      }
      
      interface Coord2AddressResult {
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
    }
    
    namespace event {
      interface MouseEvent {
        latLng: LatLng
      }
    }
  }
}

export {}
