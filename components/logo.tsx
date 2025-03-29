import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-montserrat">
        BlueSky
      </h1>
    </Link>
  )
}

