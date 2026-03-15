const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN

export function getStrapiURL(): string {
  return STRAPI_URL
}

export function getStrapiMediaUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${STRAPI_URL}${url}`
}

export async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(path, STRAPI_URL)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  }
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  }
  const res = await fetch(url.toString(), { headers })
  if (!res.ok) throw new Error(`Strapi error: ${res.status} ${res.statusText}`)
  return res.json()
}
