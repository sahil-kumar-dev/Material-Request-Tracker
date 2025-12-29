import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSignInWithPassword() {
    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { data, error };
        },
        onSuccess: () => {
            toast.success("Login successful");
        },
        onError: () => {
            toast.error("Login failed");
        }
    })
}

export function useSignUpWithPassword() {
    return useMutation({
        mutationFn: async ({ email, password, fullName, companyName }: { email: string; password: string; fullName: string; companyName: string }) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        fullName,
                        companyName,
                    },
                },
            });
            return { data, error };
        },
        onSuccess: () => {
            toast.success("Sign up successful");
        },
        onError: () => {
            toast.error("Sign up failed");
        }
    })
}