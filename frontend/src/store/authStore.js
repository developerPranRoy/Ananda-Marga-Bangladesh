// src/store/authStore.js
import { create } from "zustand";
import { supabase } from "../utils/supabase";

const useAuthStore = create((set, get) => ({
    user: null,
    profile: null,
    loading: true,

    init: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await get().fetchProfile(session.user.id);
            set({ user: session.user, loading: false });
        } else {
            set({ user: null, profile: null, loading: false });
        }
        supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await get().fetchProfile(session.user.id);
                set({ user: session.user });
            } else {
                set({ user: null, profile: null });
            }
        });
    },

    fetchProfile: async (userId) => {
        console.log("Fetching profile for:", userId);

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        console.log("Profile data:", data, "Error:", error); 

        if (data) set({ profile: data });
    },

    register: async ({ email, password, name, mobile, address, acharja, bhukti }) => {
        const { data, error } = await supabase.auth.signUp({
            email, password,
            options: { data: { display_name: name } },
        });
        if (error) throw error;
        // Update extra fields after trigger creates the row
        if (data.user) {
            await supabase.from("profiles")
                .update({ name, mobile: mobile || null, address: address || null, acharja: acharja || null, bhukti: bhukti || null })
                .eq("id", data.user.id);
        }
        return data;
    },

    login: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        set({ user: data.user });
        await get().fetchProfile(data.user.id);
        return data;
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, profile: null });
    },

    updateProfile: async (updates) => {
        const { user } = get();
        if (!user) throw new Error("Not logged in");
        const { data, error } = await supabase
            .from("profiles")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", user.id)
            .select()
            .single();
        if (error) throw error;
        set({ profile: data });
        return data;
    },
}));

export default useAuthStore;