import z from "zod";

export const signUpSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type SignUpData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignInData = z.infer<typeof signInSchema>;