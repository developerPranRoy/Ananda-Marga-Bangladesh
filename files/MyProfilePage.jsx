import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TABS = ['myPosts', 'savedPosts', 'settings']

export default function MyProfilePage() {
  const { t } = useTranslation()
  const { profile, user, updateProfile } = useAuthStore()
  const [tab, setTab] = useState('myPosts')
  const [editingPrivacy, setEditingPrivacy] = useState(false)
  const [privacy, setPrivacy] = useState({
    show_email: profile?.show_email || false,
    show_mobile: profile?.show_mobile || false,
  })

  const { data: myPosts } = useQuery({
    queryKey: ['my-posts', user?.id],
    queryFn: () => api.get('/posts?author=' + user?.id).then((r) => r.data),
    enabled: !!user?.id,
  })

  const { data: savedPosts } = useQuery({
    queryKey: ['saved-posts', user?.id],
    queryFn: () => api.get('/posts/saved').then((r) => r.data),
    enabled: tab === 'savedPosts' && !!user?.id,
  })

  const handlePrivacySave = async () => {
    try {
      await updateProfile(privacy)
      toast.success('গোপনীয়তা সেটিং সংরক্ষিত হয়েছে!')
      setEditingPrivacy(false)
    } catch {
      toast.error(t('common.error'))
    }
  }

  if (!profile) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card-am mb-6">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt={profile.name} />
                  : profile.name?.charAt(0)
                }
              </div>
              <label className="absolute -bottom-1 -right-1 btn btn-xs btn-circle btn-ghost bg-base-100 border border-base-300 cursor-pointer">
                📷
                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const form = new FormData()
                  form.append('avatar', file)
                  try {
                    const { data } = await api.post('/upload/avatar', form, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    await updateProfile({ avatar_url: data.url })
                    toast.success('ছবি আপলোড হয়েছে!')
                  } catch { toast.error(t('common.error')) }
                }} />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <span className="badge badge-outline capitalize">{profile.role}</span>
              </div>
              {profile.bhukti && <p className="text-base-content/60 text-sm mb-1">📍 {profile.bhukti}</p>}
              {profile.bio && <p className="text-sm leading-relaxed mt-2">{profile.bio}</p>}
            </div>

            <Link to="/my-profile/edit" className="btn btn-outline btn-sm">
              {t('profile.edit')}
            </Link>
          </div>

          {/* Private fields — only visible to self */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-base-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/50">{t('profile.email')}:</span>
              <span className="text-sm font-medium">{profile.email || user?.email}</span>
              <span className="badge badge-xs badge-ghost">🔒 {t('profile.private_field')}</span>
            </div>
            {profile.mobile && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/50">{t('profile.mobile')}:</span>
                <span className="text-sm font-medium">{profile.mobile}</span>
                <span className="badge badge-xs badge-ghost">🔒 {t('profile.private_field')}</span>
              </div>
            )}
            {profile.acharja && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/50">{t('profile.acharja')}:</span>
                <span className="text-sm">{profile.acharja}</span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/50">{t('profile.address')}:</span>
                <span className="text-sm">{profile.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Settings Card */}
      <div className="card-am mb-6 border-warning/30">
        <div className="card-body py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-sm">গোপনীয়তা সেটিং</h3>
              <p className="text-xs text-base-content/50">কোন তথ্য অন্যরা দেখতে পাবে</p>
            </div>
            {!editingPrivacy
              ? <button className="btn btn-ghost btn-xs" onClick={() => setEditingPrivacy(true)}>পরিবর্তন করুন</button>
              : <div className="flex gap-2">
                  <button className="btn btn-success btn-xs text-white" onClick={handlePrivacySave}>সংরক্ষণ</button>
                  <button className="btn btn-ghost btn-xs" onClick={() => setEditingPrivacy(false)}>বাতিল</button>
                </div>
            }
          </div>
          {editingPrivacy && (
            <div className="flex flex-wrap gap-6 mt-3 pt-3 border-t border-base-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="toggle toggle-sm toggle-success"
                  checked={privacy.show_email}
                  onChange={(e) => setPrivacy({ ...privacy, show_email: e.target.checked })}
                />
                <span className="text-sm">ইমেইল অন্যরা দেখতে পাবে</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="toggle toggle-sm toggle-success"
                  checked={privacy.show_mobile}
                  onChange={(e) => setPrivacy({ ...privacy, show_mobile: e.target.checked })}
                />
                <span className="text-sm">মোবাইল অন্যরা দেখতে পাবে</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        <button className={`tab ${tab === 'myPosts' ? 'tab-active' : ''}`} onClick={() => setTab('myPosts')}>
          {t('profile.my_posts')} {myPosts?.data?.length > 0 && `(${myPosts.data.length})`}
        </button>
        <button className={`tab ${tab === 'savedPosts' ? 'tab-active' : ''}`} onClick={() => setTab('savedPosts')}>
          {t('profile.saved_posts')}
        </button>
      </div>

      {/* My Posts */}
      {tab === 'myPosts' && (
        <div className="space-y-3">
          {myPosts?.data?.length > 0 ? myPosts.data.map((post) => (
            <div key={post.id} className="card-am card-body flex-row items-center justify-between py-3">
              <div>
                <Link to={`/blog/${post.slug}`} className="font-medium hover:text-primary transition-colors">
                  {post.title}
                </Link>
                <div className="flex gap-3 text-xs text-base-content/50 mt-1">
                  <span>{post.is_published ? '✅ প্রকাশিত' : '📝 ড্রাফট'}</span>
                  <span>👁 {post.view_count}</span>
                </div>
              </div>
              <Link to={`/blog/edit/${post.id}`} className="btn btn-ghost btn-xs">সম্পাদনা</Link>
            </div>
          )) : (
            <div className="text-center text-base-content/40 py-12">
              <p>এখনো কোনো পোস্ট নেই</p>
              <Link to="/blog/new" className="btn btn-success btn-sm text-white mt-3">{t('nav.newPost')}</Link>
            </div>
          )}
        </div>
      )}

      {/* Saved Posts */}
      {tab === 'savedPosts' && (
        <div className="space-y-3">
          {savedPosts?.length > 0 ? savedPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="card-am card-body block hover:shadow-md transition-all">
              <div className="font-medium">{post.title}</div>
              <div className="text-xs text-base-content/50 mt-1">{post.profiles?.name}</div>
            </Link>
          )) : (
            <div className="text-center text-base-content/40 py-12">
              <p>কোনো সংরক্ষিত পোস্ট নেই</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
