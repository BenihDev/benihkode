import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to the edu tech blogging platform
          </p>
        </div>
        <div className="space-y-4">
          <form
            action={async () => {
              'use server';
              await signIn('google');
            }}
          >
            <Button type="submit" className="w-full" size="lg">
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
