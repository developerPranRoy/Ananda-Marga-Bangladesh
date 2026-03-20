const express = require('express')
const { supabaseAdmin } = require('../config/supabase')
const { authenticate, requireAdmin } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')
const { auditLog } = require('../utils/auditLog')

const router = express.Router()

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin)

// GET /api/admin/stats — dashboard numbers
router.get('/stats', asyncHandler(async (req, res) => {
    const { data } = await supabaseAdmin.rpc('admin_get_stats')
    res.json(data)
}))

// GET /api/admin/members — FULL member list with email + mobile (admin only)
router.get('/members', asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search, role, bhukti } = req.query
    const offset = (page - 1) * limit

    let q = supabaseAdmin
        .from('profiles')
        .select('id, name, email, mobile, role, bhukti, acharja, address, is_active, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    if (role) q = q.eq('role', role)
    if (bhukti) q = q.eq('bhukti', bhukti)

    const { data, count, error } = await q
    if (error) throw error

    res.json({ data, total: count, page: +page, limit: +limit })
}))

// PATCH /api/admin/members/:id/role — change member role
router.patch('/members/:id/role', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { role } = req.body
    const allowed = ['member', 'acharja', 'admin']
    if (!allowed.includes(role)) return res.status(400).json({ error: 'Invalid role' })

    const { data, error } = await supabaseAdmin
        .from('profiles').update({ role }).eq('id', id).select().single()
    if (error) throw error

    await auditLog({
        userId: req.user.id,
        action: 'admin.change_role',
        resourceType: 'profile',
        resourceId: id,
        metadata: { new_role: role },
        ip: req.ip,
    })

    res.json(data)
}))

// PATCH /api/admin/members/:id/status — activate/deactivate
router.patch('/members/:id/status', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { is_active } = req.body

    const { data, error } = await supabaseAdmin
        .from('profiles').update({ is_active: !!is_active }).eq('id', id).select().single()
    if (error) throw error

    await auditLog({
        userId: req.user.id,
        action: is_active ? 'admin.activate_user' : 'admin.deactivate_user',
        resourceType: 'profile',
        resourceId: id,
        ip: req.ip,
    })

    res.json(data)
}))

// GET /api/admin/posts — all posts including drafts
router.get('/posts', asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    const { data, count, error } = await supabaseAdmin
        .from('posts')
        .select(`
      id, title, slug, is_published, view_count, created_at, published_at,
      profiles!author_id(id, name)
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) throw error
    res.json({ data, total: count })
}))

// DELETE /api/admin/posts/:id — admin can delete any post
router.delete('/posts/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id)
    if (error) throw error
    await auditLog({ userId: req.user.id, action: 'admin.delete_post', resourceType: 'post', resourceId: id, ip: req.ip })
    res.json({ message: 'Post deleted' })
}))

// GET /api/admin/contacts — unread contact form submissions
router.get('/contacts', asyncHandler(async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
    if (error) throw error
    res.json(data)
}))

// PATCH /api/admin/contacts/:id/read
router.patch('/contacts/:id/read', asyncHandler(async (req, res) => {
    await supabaseAdmin.from('contacts').update({ is_read: true }).eq('id', req.params.id)
    res.json({ message: 'Marked as read' })
}))

// GET /api/admin/audit-logs
router.get('/audit-logs', asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query
    const offset = (page - 1) * limit

    const { data, count, error } = await supabaseAdmin
        .from('audit_logs')
        .select(`
      id, action, resource_type, resource_id, metadata, ip_address, created_at,
      profiles!user_id(id, name, role)
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) throw error
    res.json({ data, total: count })
}))

module.exports = router