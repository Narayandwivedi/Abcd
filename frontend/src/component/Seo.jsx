import { useEffect } from 'react'

const SITE_URL = 'https://abcdvyapar.com'
const DEFAULT_IMAGE = '/abcd%20logo3.png'

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

const Seo = ({
  title = 'ABCD Vyapar',
  description = 'ABCD Vyapar - Your Business Partner for Products and Services',
  canonicalPath = '/',
  robots = 'index, follow',
  image = DEFAULT_IMAGE,
  type = 'website',
  structuredData,
}) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${canonicalPath}`
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

    document.title = title

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robots,
    })
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    })
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    })
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: imageUrl,
    })
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: imageUrl,
    })

    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    })

    const existingSchema = document.getElementById('seo-structured-data')
    if (existingSchema) {
      existingSchema.remove()
    }

    if (structuredData) {
      const script = document.createElement('script')
      script.id = 'seo-structured-data'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
  }, [canonicalPath, description, image, robots, structuredData, title, type])

  return null
}

export default Seo
