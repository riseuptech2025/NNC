import React from 'react'
import { Helmet } from 'react-helmet-async'
import useStore from '../../store/useStore'

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  articleSection
}) => {
  const { seoSettings } = useStore()
  const siteTitle = seoSettings?.siteTitle || 'NNC - Nepali News Center'
  const siteDescription = seoSettings?.siteDescription || 'Latest news from Nepal'
  const siteUrl = window.location.origin
  const currentUrl = url || window.location.href
  const imageUrl = image || `${siteUrl}/default-og-image.jpg`

  const fullTitle = title ? `${title} - ${siteTitle}` : siteTitle
  const metaDescription = description || siteDescription

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords || seoSettings?.siteKeywords} />
      <meta name="author" content={author || seoSettings?.authorName} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteTitle} />
      {seoSettings?.facebookAppId && (
        <meta property="fb:app_id" content={seoSettings.facebookAppId} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      {seoSettings?.twitterHandle && (
        <meta name="twitter:site" content={seoSettings.twitterHandle} />
      )}

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime || publishedTime} />
          <meta property="article:author" content={author || seoSettings?.authorName} />
          <meta property="article:section" content={articleSection} />
        </>
      )}

      {/* Verification tags */}
      {seoSettings?.googleSiteVerification && (
        <meta name="google-site-verification" content={seoSettings.googleSiteVerification} />
      )}
      {seoSettings?.bingSiteVerification && (
        <meta name="msvalidate.01" content={seoSettings.bingSiteVerification} />
      )}

      {/* Custom Head Scripts */}
      {seoSettings?.customHeadScripts && (
        <script>{seoSettings.customHeadScripts}</script>
      )}

      {/* Google Analytics */}
      {seoSettings?.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${seoSettings.googleAnalyticsId}`} />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoSettings.googleAnalyticsId}');
            `}
          </script>
        </>
      )}
    </Helmet>
  )
}

export default SEOHead