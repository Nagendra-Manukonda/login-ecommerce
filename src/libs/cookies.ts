
export function setCookie(name: string, value: string, days = 7) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `; expires=${date.toUTCString()}`
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ")
  for (let c of cookies) {
    const [key, val] = c.split("=")
    if (key === name) return decodeURIComponent(val)
  }
  return null
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
