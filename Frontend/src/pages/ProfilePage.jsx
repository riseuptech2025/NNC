import React from 'react'
import { Helmet } from 'react-helmet-async'
import { FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa'
import useStore from '../store/useStore'

const ProfilePage = () => {
  const { admin } = useStore()

  // For demo purposes - in real app, fetch user's activity
  const userActivity = {
    comments: 15,
    reactions: 47,
    savedArticles: 8
  }

  return (
    <>
      <Helmet>
        <title>My Profile - NNC</title>
      </Helmet>

      <div className="container-custom py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary-600 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              </div>
              <div className="sm:ml-4 mt-4 sm:mt-0 text-center sm:text-left">
                <h2 className="text-2xl font-bold">{admin?.email || 'Admin User'}</h2>
                <p className="text-gray-600 dark:text-gray-400">Administrator</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <FaEnvelope />
                  <span>{admin?.email || 'admin@nnc.com'}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                  <FaCalendar />
                  <span>Member since January 2024</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Activity Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <div className="text-2xl font-bold text-primary-600">
                      {userActivity.comments}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Comments
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <div className="text-2xl font-bold text-primary-600">
                      {userActivity.reactions}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Reactions
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    <div className="text-2xl font-bold text-primary-600">
                      {userActivity.savedArticles}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Saved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage