import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardHat } from 'lucide-react';

export function AuthPage() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-secondary/30 p-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
                        <HardHat className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">BuildTrack</h1>
                    <p className="text-muted-foreground mt-2">Material Request Tracker</p>
                </div>

                <Card className="border-border/50 shadow-lg">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 m-0 rounded-b-none">
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="mt-0">
                            <SignInForm />
                        </TabsContent>

                        <TabsContent value="signup" className="mt-0">
                            <SignUpForm />
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
