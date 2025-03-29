export interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  sys: {
    sunrise: number
    sunset: number
    country: string
  }
  name: string
  dt: number
  timezone: number
  visibility: number
  rain?: {
    "1h"?: number
    "3h"?: number
  }
}

export interface ForecastData {
  list: {
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      humidity: number
    }
    weather: {
      id: number
      main: string
      description: string
      icon: string
    }[]
    clouds: {
      all: number
    }
    wind: {
      speed: number
      deg: number
    }
    pop: number // Probability of precipitation
    rain?: {
      "3h": number
    }
    dt_txt: string
  }[]
  city: {
    name: string
    country: string
    sunrise: number
    sunset: number
  }
}

export interface LocationData {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

