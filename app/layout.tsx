import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { ThemeProvider, ColorProvider } from "@/components/theme-provider"
import Script from "next/script"

// Use Montserrat as a similar alternative to Modulus Pro
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Weather Dashboard",
  description: "Real-time weather information",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload Leaflet resources */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
      </head>
      <body className={`${inter.className} ${montserrat.variable} h-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ColorProvider>{children}</ColorProvider>
        </ThemeProvider>

        {/* Fallback script to ensure Leaflet loads */}
        <Script
          id="leaflet-fallback"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.handleLeafletError = function() {
                if (!window.L && !window._leafletLoading) {
                  window._leafletLoading = true;
                  console.log('Attempting to load Leaflet as fallback');
                  
                  var link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                  document.head.appendChild(link);
                  
                  var script = document.createElement('script');
                  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                  script.async = true;
                  document.head.appendChild(script);
                }
              };
              
              // Try to load Leaflet after 3 seconds if not already loaded
              setTimeout(window.handleLeafletError, 3000);
            `,
          }}
        />
      </body>
    </html>
  )
}



import './globals.css'