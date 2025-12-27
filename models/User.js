import supabase from '../config/supabase.js'
import bcrypt from 'bcryptjs'

export const User = {
    async findByUsername(username) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('id, username, role, created_at')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async create(userData) {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(userData.password, salt)

        const { data, error } = await supabase
            .from('users')
            .insert([{
                username: userData.username,
                password_hash: passwordHash,
                role: userData.role || 'admin'
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword)
    }
}

export default User
