import React from 'react'
import { Helmet } from 'react-helmet-async'

const SchemaMarkup = ({ type, data }) => {
  const generateSchema = () => {
    switch (type) {
      case 'newsArticle':
        return {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": data.title,
          "description": data.description,
          "image": data.image,
          "datePublished": data.publishedAt,
          "dateModified": data.modifiedAt || data.publishedAt,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "Nepali News Center",
            "logo": {
              "@type": "ImageObject",
              "url": `${window.location.origin}/logo.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          }
        }

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": data.name,
          "description": data.description,
          "url": data.url,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${data.url}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        }

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": data.name,
          "url": data.url,
          "logo": data.logo,
          "sameAs": data.socialLinks
        }

      default:
        return null
    }
  }

  const schema = generateSchema()

  if (!schema) return null

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  )
}

export default SchemaMarkup