import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import useStore from '../../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'

const SEOSettings = () => {
  const { isAuthenticated, token } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    siteTitle: 'NNC - Nepali News Center',
    siteDescription: 'Latest news from Nepal including politics, technology, sports, business, entertainment and health.',
    siteKeywords: 'Nepali news, Nepal news, politics Nepal, technology Nepal, sports Nepal',
    authorName: 'NNC Team',
    twitterHandle: '@nncnews',
    facebookPage: '',
    googleAnalyticsId: '',
    googleAdSenseId: '',
    adsterraId: '',
    googleSiteVerification: '',
    bingSiteVerification: '',
    facebookAppId: '',
    robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml`,
    customHeadScripts: '',
    customBodyScripts: ''
  })

  useEffect(() => {
    fetchSEOSettings()
  }, [])

  const fetchSEOSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/seo/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFormData(response.data)
    } catch (error) {
      console.error('Error fetching SEO settings:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/seo/settings`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast.success('SEO settings updated successfully')
    } catch (error) {
      toast.error('Failed to update SEO settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>SEO Settings - NNC Admin</title>
      </Helmet>

      <div className="container-custom py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">SEO Settings</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Basic SEO */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic SEO</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Title</label>
                  <input
                    type="text"
                    name="siteTitle"
                    value={formData.siteTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <textarea
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Keywords</label>
                  <input
                    type="text"
                    name="siteKeywords"
                    value={formData.siteKeywords}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma separated keywords</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Author Name</label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold mb-4">Social Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Twitter Handle</label>
                  <input
                    type="text"
                    name="twitterHandle"
                    value={formData.twitterHandle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Facebook Page URL</label>
                  <input
                    type="url"
                    name="facebookPage"
                    value={formData.facebookPage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Facebook App ID</label>
                  <input
                    type="text"
                    name="facebookAppId"
                    value={formData.facebookAppId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Analytics & Ads */}
            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold mb-4">Analytics & Advertising</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Google Analytics ID</label>
                  <input
                    type="text"
                    name="googleAnalyticsId"
                    value={formData.googleAnalyticsId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Google AdSense ID</label>
                  <input
                    type="text"
                    name="googleAdSenseId"
                    value={formData.googleAdSenseId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                    placeholder="ca-pub-xxxxxxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Adsterra ID</label>
                  <input
                    type="text"
                    name="adsterraId"
                    value={formData.adsterraId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold mb-4">Site Verification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Google Site Verification</label>
                  <input
                    type="text"
                    name="googleSiteVerification"
                    value={formData.googleSiteVerification}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bing Site Verification</label>
                  <input
                    type="text"
                    name="bingSiteVerification"
                    value={formData.bingSiteVerification}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Advanced */}
            <div className="border-t dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold mb-4">Advanced</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">robots.txt</label>
                  <textarea
                    name="robotsTxt"
                    value={formData.robotsTxt}
                    onChange={handleChange}
                    rows="8"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Custom Head Scripts</label>
                  <textarea
                    name="customHeadScripts"
                    value={formData.customHeadScripts}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 font-mono text-sm"
                    placeholder="<script>...</script>"
                  />
                  <p className="text-xs text-gray-500 mt-1">Will be injected in the &lt;head&gt; section</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Custom Body Scripts</label>
                  <textarea
                    name="customBodyScripts"
                    value={formData.customBodyScripts}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 font-mono text-sm"
                    placeholder="<script>...</script>"
                  />
                  <p className="text-xs text-gray-500 mt-1">Will be injected at the end of &lt;body&gt;</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default SEOSettings