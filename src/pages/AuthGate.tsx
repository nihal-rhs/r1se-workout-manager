import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { R1SELogo } from '@/components/R1SELogo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Dumbbell, LineChart, Zap } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" aria-hidden="true" fill="hsl(var(--primary))">
    <path d="M12 10.2v3.92h5.45c-.24 1.4-1.7 4.1-5.45 4.1-3.28 0-5.96-2.72-5.96-6.07S8.72 6.08 12 6.08c1.87 0 3.12.8 3.83 1.48l2.61-2.52C16.78 3.5 14.6 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12s4.26 9.5 9.5 9.5c5.48 0 9.12-3.85 9.12-9.27 0-.62-.07-1.1-.16-1.57H12z"/>
  </svg>
);

const features = [
  { icon: Dumbbell, label: 'Train' },
  { icon: LineChart, label: 'Track' },
  { icon: Zap, label: 'R1SE' },
];

export default function AuthGate() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({ title: 'Authentication failed', description: result.error.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Authentication failed', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Ambient neon glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-primary/[0.07] blur-[160px]" />
        <div className="absolute bottom-[-180px] left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-primary/[0.05] blur-[120px]" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm flex flex-col items-center gap-14 animate-fade-in">
          {/* Brand */}
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 -m-6 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
              <R1SELogo className="relative text-6xl text-primary" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-px w-14 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <p className="text-muted-foreground text-[13px] tracking-[0.3em] uppercase font-medium">
                Train Smart · R1SE Harder
              </p>
            </div>
          </div>

          {/* Feature trio */}
          <div className="flex items-center gap-10">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2.5">
                <div className="h-12 w-12 rounded-full border border-border/60 bg-card/40 flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                <span className="text-[12px] tracking-[0.18em] uppercase text-muted-foreground font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Auth */}
          <div className="w-full flex flex-col gap-4">
            <Button
              size="lg"
              onClick={handleAuth}
              disabled={loading}
              glow
              className="w-full h-12 text-sm font-semibold tracking-wide gap-3 rounded-xl"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background">
                  <GoogleIcon />
                </span>
              )}
              Continue with Google
            </Button>

            <p className="text-center text-[12px] text-muted-foreground/80 leading-relaxed px-4">
              By continuing, you agree to our{' '}
              <span className="text-foreground/70 underline-offset-4 hover:underline cursor-pointer">Terms</span>
              {' '}and{' '}
              <span className="text-foreground/70 underline-offset-4 hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer mark */}
      <footer className="relative z-10 pb-6 flex justify-center">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-foreground/70">
          <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-100 animate-pulse shadow-[0_0_20px_hsl(189_100%_51%/0.8),0_0_40px_hsl(189_100%_51%/0.4)]" />
          <span>Built for lifters</span>
        </div>
      </footer>
    </div>
  );
}
