import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('itools.token')?.value

  const accessDeniedUrl = new URL('/', request.url)

  if (token) {
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect('/dashboard')
    }
  } else if (!token) {
    if (request.nextUrl.pathname === '/dashboard') {
      return NextResponse.redirect(accessDeniedUrl)
    }
  }
  return NextResponse.next()
}
