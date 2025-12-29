import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignUpWithPassword } from '@/hooks/use-auth'
import { signUpSchema, type SignUpData } from '@/schema'
import useAuthStore from '@/store/useAuthStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'


export default function SignUpForm() {

    const { setLoading, setError, loading, error } = useAuthStore();

    const signUpMutation = useSignUpWithPassword();

    const signupForm = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
    });

    const handleSignUp = async (data: SignUpData) => {
        setLoading(true);
        setError(null);
        const { error } = await signUpMutation.mutateAsync(data)
        if (error) {
            setError(error.message);
        }
        setLoading(false);  
    };
    return (
        <>
            <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>Get started with your team's material tracking</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={signupForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                            id="signup-name"
                            placeholder="John Doe"
                            {...signupForm.register('fullName')}
                        />
                        {signupForm.formState.errors.fullName && (
                            <p className="text-sm text-destructive">{signupForm.formState.errors.fullName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-company">Company Name</Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="signup-company"
                                className="pl-10"
                                placeholder="ABC Construction"
                                {...signupForm.register('companyName')}
                            />
                        </div>
                        {signupForm.formState.errors.companyName && (
                            <p className="text-sm text-destructive">{signupForm.formState.errors.companyName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@company.com"
                            {...signupForm.register('email')}
                        />
                        {signupForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            {...signupForm.register('password')}
                        />
                        {signupForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                        )}
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </form>
            </CardContent>
        </>
    )
}
