import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'পছন্দ / Like' },
  { type: 'love', emoji: '❤️', label: 'ভালোবাসা / Love' },
  { type: 'insightful', emoji: '💡', label: 'শিক্ষণীয় / Insightful' },
]

export default function BlogEngagement({ post, userReaction, reactionCounts, viewCount }) {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuthStore()
  const [myReaction, setMyReaction] = useState(userReaction || null)
  const [counts, setCounts] = useState(reactionCounts || { like: 0, love: 0, insightful: 0 })
  const [saved, setSaved] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [sharing, setSharing] = useState(false)

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0)

  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      toast.error(t('blog.login_to_like'))
      return
    }
    const isSame = myReaction === type
    const prev = myReaction
    const prevCounts = { ...counts }

    // Optimistic update
    if (isSame) {
      setMyReaction(null)
      setCounts((c) => ({ ...c, [type]: Math.max(0, c[type] - 1) }))
    } else {
      if (prev) setCounts((c) => ({ ...c, [prev]: Math.max(0, c[prev] - 1) }))
      setMyReaction(type)
      setCounts((c) => ({ ...c, [type]: c[type] + 1 }))
    }
    setShowReactions(false)

    try {
      if (isSame) {
        await supabase.from('reactions')
          .delete()
          .match({ post_id: post.id, user_id: user.id })
      } else {
        await supabase.from('reactions')
          .upsert({ post_id: post.id, user_id: user.id, type })
      }
    } catch {
      setMyReaction(prev)
      setCounts(prevCounts)
      toast.error(t('common.error'))
    }
  }

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error(t('blog.login_to_like')); return }
    const newSaved = !saved
    setSaved(newSaved)
    try {
      if (newSaved) {
        await supabase.from('saved_posts').insert({ post_id: post.id, user_id: user.id })
        toast.success('পোস্ট সংরক্ষিত হয়েছে!')
      } else {
        await supabase.from('saved_posts').delete().match({ post_id: post.id, user_id: user.id })
        toast('সংরক্ষণ বাতিল হয়েছে')
      }
    } catch { setSaved(!newSaved) }
  }

  const handleShare = async () => {
    const url = window.location.href
    const text = post.title

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url })
        return
      } catch { /* fallback */ }
    }

    setSharing(true)
    const options = [
      { label: '🔗 লিঙ্ক কপি করুন', action: () => { navigator.clipboard.writeText(url); toast.success('লিঙ্ক কপি হয়েছে!') } },
      { label: '📱 WhatsApp', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`) },
      { label: '📘 Facebook', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`) },
    ]

    options.forEach((o) => o.action())
    setSharing(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-base-300">
      {/* Reaction button with picker */}
      <div className="relative">
        <div className="flex items-center gap-1">
          <button
            className={`btn btn-sm gap-1 ${myReaction ? 'btn-success text-white' : 'btn-ghost'}`}
            onClick={() => setShowReactions((v) => !v)}
          >
            <span>{myReaction ? REACTIONS.find((r) => r.type === myReaction)?.emoji : '👍'}</span>
            <span className="text-xs">{totalReactions > 0 ? totalReactions : t('blog.like')}</span>
          </button>
          {totalReactions > 0 && (
            <div className="flex -space-x-1">
              {Object.entries(counts).filter(([, c]) => c > 0).slice(0, 3).map(([type]) => (
                <span key={type} className="text-xs">{REACTIONS.find((r) => r.type === type)?.emoji}</span>
              ))}
            </div>
          )}
        </div>
        {showReactions && (
          <div className="absolute bottom-full left-0 mb-2 flex gap-1 bg-base-100 border border-base-300 rounded-2xl shadow-lg p-2 z-10">
            {REACTIONS.map((r) => (
              <button
                key={r.type}
                title={r.label}
                className={`btn btn-ghost btn-xs text-xl hover:scale-125 transition-transform ${myReaction === r.type ? 'bg-success/10' : ''}`}
                onClick={() => handleReaction(r.type)}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comment count */}
      <button className="btn btn-ghost btn-sm gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="text-xs">{t('blog.comment')}</span>
      </button>

      {/* Share */}
      <div className="dropdown dropdown-top">
        <button tabIndex={0} className="btn btn-ghost btn-sm gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="text-xs">{t('blog.share')}</span>
        </button>
        <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box border border-base-300 w-44">
          <li><button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('লিঙ্ক কপি হয়েছে!') }}>🔗 লিঙ্ক কপি</button></li>
          <li><button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`)}>📱 WhatsApp</button></li>
          <li><button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}>📘 Facebook</button></li>
        </ul>
      </div>

      {/* Save / Bookmark */}
      <button
        onClick={handleSave}
        className={`btn btn-ghost btn-sm gap-1 ${saved ? 'text-warning' : ''}`}
      >
        <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span className="text-xs">{t('blog.save')}</span>
      </button>

      {/* Views + Reading time */}
      <div className="ml-auto flex items-center gap-3 text-xs text-base-content/50">
        {post.reading_time > 0 && (
          <span>⏱ {post.reading_time} {t('blog.reading_time')}</span>
        )}
        <span>👁 {viewCount || post.view_count || 0} {t('blog.views')}</span>
      </div>
    </div>
  )
}
