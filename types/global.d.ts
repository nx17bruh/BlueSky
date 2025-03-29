interface Window {
  L: any
}

// Leaflet types
declare namespace L {
  class Map {
    constructor(element: string | HTMLElement, options?: any)
    setView(center: [number, number], zoom: number): this
    remove(): this
    on(event: string, handler: Function): this
    eachLayer(callback: (layer: any) => void): this
    removeLayer(layer: any): this
    invalidateSize(options?: { animate?: boolean }): this
    setMaxBounds(bounds: any): this
  }

  class TileLayer {
    constructor(urlTemplate: string, options?: any)
    addTo(map: Map): this
  }

  function map(element: string | HTMLElement, options?: any): Map
  function tileLayer(urlTemplate: string, options?: any): TileLayer
  function latLng(lat: number, lng: number): any
  function latLngBounds(corner1: any, corner2: any): any

  namespace control {
    function attribution(options?: any): any
  }
}

