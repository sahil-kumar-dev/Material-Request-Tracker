import { Loader2 } from 'lucide-react'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { signInSchema, type SignInData } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuthStore from '@/store/useAuthStore'
import { useSignInWithPassword } from '@/hooks/use-auth'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function SignInForm() {

    const signInWithPassword = useSignInWithPassword();
    const loginForm = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
    })

    const { setLoading, setError, loading, error } = useAuthStore();

    const handleSignIn = async (data: SignInData) => {
        setLoading(true);
        const { error } = await signInWithPassword.mutateAsync(data);
        if (error) {
            setError(error.message);
        }
        setLoading(false);
    }

    return (
        <>
            <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={loginForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                        <Label id="login-email">Email</Label>
                        <Input
                            id="login-email"
                            type="email"
                            placeholder="you@company.com"
                            {...loginForm.register('email')}
                        />
                        {loginForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label id="login-password">Password</Label>
                        <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            {...loginForm.register('password')}
                        />
                        {loginForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                        )}
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>
            </CardContent>
        </>
    )
}
