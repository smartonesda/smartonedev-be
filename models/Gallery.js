import supabase from '../config/supabase.js'

export const Gallery = {
    async findAll() {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async findBySlug(slug) {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error) throw error
        return data
    },

    async create(projectData) {
        const { data, error } = await supabase
            .from('gallery')
            .insert([{
                title: projectData.title,
                slug: projectData.slug || projectData.title.toLowerCase().replace(/\s+/g, '-'),
                category: projectData.category,
                description: projectData.description,
                image: projectData.image || null,
                screenshots: projectData.screenshots || [],
                story: projectData.story || {},
                timeline: projectData.timeline || [],
                team: projectData.team || [],
                tech: projectData.tech || [],
                author: projectData.author,
                stars: projectData.stars || 0,
                collab_open: projectData.collab_open || false,
                bg_gradient: projectData.bg_gradient || 'from-red-600 to-red-900',
                icon: projectData.icon || 'globe',
                github_url: projectData.github_url || null,
                demo_url: projectData.demo_url || null,
                login_credentials: projectData.login_credentials || []
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id, projectData) {
        const updateData = {
            updated_at: new Date().toISOString()
        }

        // Only include fields that are provided
        if (projectData.title !== undefined) updateData.title = projectData.title
        if (projectData.slug !== undefined) updateData.slug = projectData.slug
        if (projectData.category !== undefined) updateData.category = projectData.category
        if (projectData.description !== undefined) updateData.description = projectData.description
        if (projectData.image !== undefined) updateData.image = projectData.image
        if (projectData.screenshots !== undefined) updateData.screenshots = projectData.screenshots
        if (projectData.story !== undefined) updateData.story = projectData.story
        if (projectData.timeline !== undefined) updateData.timeline = projectData.timeline
        if (projectData.team !== undefined) updateData.team = projectData.team
        if (projectData.tech !== undefined) updateData.tech = projectData.tech
        if (projectData.author !== undefined) updateData.author = projectData.author
        if (projectData.stars !== undefined) updateData.stars = projectData.stars
        if (projectData.collab_open !== undefined) updateData.collab_open = projectData.collab_open
        if (projectData.bg_gradient !== undefined) updateData.bg_gradient = projectData.bg_gradient
        if (projectData.icon !== undefined) updateData.icon = projectData.icon
        if (projectData.github_url !== undefined) updateData.github_url = projectData.github_url
        if (projectData.demo_url !== undefined) updateData.demo_url = projectData.demo_url
        if (projectData.login_credentials !== undefined) updateData.login_credentials = projectData.login_credentials

        const { data, error } = await supabase
            .from('gallery')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async delete(id) {
        const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    },

    // Upload image to Supabase Storage
    async uploadImage(file, filename, contentType = 'image/jpeg') {
        const { data, error } = await supabase.storage
            .from('gallery-images')
            .upload(filename, file, {
                cacheControl: '3600',
                upsert: true,
                contentType: contentType
            })

        if (error) throw error

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('gallery-images')
            .getPublicUrl(filename)

        return urlData.publicUrl
    },

    // Delete image from Supabase Storage
    async deleteImage(filename) {
        const { error } = await supabase.storage
            .from('gallery-images')
            .remove([filename])

        if (error) throw error
        return true
    }
}

export default Gallery
