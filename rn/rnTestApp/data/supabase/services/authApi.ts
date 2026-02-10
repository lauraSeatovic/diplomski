
import { supabase } from "./supabaseClient";

export type UserRole = "TRENER" | "SPORTAS";

async function existsInTable(table: "Trener" | "Sportas", userId: string) {
  const { data, error } = await supabase
    .from(table)
    .select("IdKorisnika")
    .eq("IdKorisnika", userId)
    .maybeSingle();

  if (error) throw error;
  return data != null;
}

export const authApi = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) throw new Error("Login failed: user is null");
    return data.user.id;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUserId(): Promise<string | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user?.id ?? null;
  },

  async getCurrentUserRole(userId: string): Promise<UserRole> {
    const isTrener = await existsInTable("Trener", userId);
    if (isTrener) return "TRENER";

    const isSportas = await existsInTable("Sportas", userId);
    if (isSportas) return "SPORTAS";

    return "SPORTAS";
  },
};
