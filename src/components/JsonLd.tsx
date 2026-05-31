type PersonSchemaProps = {
  name: string
  jobTitle?: string
  url: string
  email?: string | null
  location?: string | null
  socialLinks?: Array<{ url: string; label?: string; id?: string | null }> | null
}

export function PersonJsonLd({ name, jobTitle, url, email, location, socialLinks }: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url,
    email,
    address: location ? { '@type': 'PostalAddress', addressLocality: location } : undefined,
    sameAs: socialLinks?.map((l) => l.url).filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
