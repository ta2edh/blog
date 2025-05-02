import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Space_Mono } from "next/font/google"

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Erdem Hacisalihoglu (TA2EDH) Blog",
  description: "Erdem Hacisalihoglu's blog for amateur radio, electronics, and software development",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={spaceMono.className}>
        {children}
      </body>
    </html>
  )
}
