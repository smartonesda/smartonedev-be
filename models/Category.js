import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

const Category = {
    // Get all categories
    async findAll() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        if (error) throw error
        return data || []
    },

    // Get category by ID
    async findById(id) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Get category by name
    async findByName(name) {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('name', name)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    // Create new category
    async create(categoryData) {
        const slug = categoryData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const { data, error } = await supabase
            .from('categories')
            .insert([{
                name: categoryData.name,
                slug: slug,
                color: categoryData.color || '#dc2626',
                icon: categoryData.icon || 'folder'
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Update category
    async update(id, categoryData) {
        const updateData = {}
        if (categoryData.name) {
            updateData.name = categoryData.name
            updateData.slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
        }
        if (categoryData.color) updateData.color = categoryData.color
        if (categoryData.icon) updateData.icon = categoryData.icon

        const { data, error } = await supabase
            .from('categories')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Check if category is in use by any project
    async isInUse(categoryName) {
        const { data, error } = await supabase
            .from('gallery')
            .select('id')
            .eq('category', categoryName)
            .limit(1)

        if (error) throw error
        return data && data.length > 0
    },

    // Delete category (only if not in use)
    async delete(id) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    }
}

export default Category
