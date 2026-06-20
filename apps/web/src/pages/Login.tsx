import { useState } from 'react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex w-full min-h-screen overflow-hidden bg-background text-on-background">
      {/* Left Section: Branding & Hero */}
      <section className="hidden lg:flex w-1/2 relative bg-primary-container items-center justify-center p-xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBP9y8dAldprsKlp-qt8fr2SnaYnnAUsGcTkOtsK44lshku2e5BItoHYLDlc_GWd5BjtG8nT272UYQgEe0NlBieXBXjXrtVEK99_stCMVNHqrxBad-DkrkUeAt-4FakDHHH0rU2sR-L-NH1sJT8GjF6XTKWlI5BkiAbqwMKrvCb3q7vYRbsD2dyFQCPhc-oPBzh2EKw3DnLFH8xi4DuBmchjDGKTyLThRyordtwIy4lKjna0jv_fDLCNw3Xrcs9_yES0UERZovFgHvV')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent mix-blend-multiply"></div>
        </div>
        {/* Content Overlay */}
        <div className="relative z-10 max-w-lg text-on-primary">
          <div className="flex items-center gap-sm mb-xl">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight">ECOFlow</h1>
          </div>
          <h2 className="font-display-lg text-display-lg mb-md leading-tight">Mastering Precision in Furniture Engineering.</h2>
          <p className="font-body-lg text-body-lg text-on-primary/90 opacity-90 max-w-md">
            Seamlessly manage Engineering Change Orders with absolute control. Join thousands of engineers optimizing product lifecycles.
          </p>
          {/* Bottom Decorative Element */}
          <div className="mt-2xl flex items-center gap-md">
            <div className="h-[1px] w-12 bg-on-primary/40"></div>
            <span className="font-label-md text-label-md uppercase tracking-widest text-on-primary/60">Industrial Excellence</span>
          </div>
        </div>
      </section>

      {/* Right Section: Authentication Form */}
      <section className="w-full lg:w-1/2 flex flex-col bg-surface-container-lowest justify-center px-margin-mobile md:px-2xl py-xl">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Branding (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center gap-sm mb-xl">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">ECOFlow</h1>
          </div>

          <div className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Access your engineering dashboard and ECO management tools.</p>
          </div>

          {/* Login Form */}
          <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div className="space-y-sm">
              <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full h-12 pl-[48px] pr-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary input-focus-ring transition-all placeholder:text-outline/50" 
                  id="email" 
                  placeholder="name@company.com" 
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="password">Password</label>
                <a className="font-label-md text-label-md text-primary hover:underline transition-all" href="#">Forgot Password?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full h-12 pl-[48px] pr-[48px] bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary input-focus-ring transition-all placeholder:text-outline/50" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? 'text' : 'password'}
                />
                <button 
                  className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                >
                  <span className="material-symbols-outlined" id="passwordIcon">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-sm">
              <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 cursor-pointer" id="remember" type="checkbox" />
              <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer" htmlFor="remember">Keep me logged in for 30 days</label>
            </div>

            {/* CTA Button */}
            <button className="w-full h-12 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary-container hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-sm group">
              <span>Secure Login</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">login</span>
            </button>
          </form>

          {/* Support Footer */}
          <div className="mt-xl pt-lg border-t border-outline-variant/30 flex flex-col items-center gap-md">
            <p className="font-body-sm text-body-sm text-outline">Don't have an enterprise account yet?</p>
            <a className="font-label-lg text-label-lg text-primary hover:text-primary-container font-bold transition-colors flex items-center gap-xs" href="/request-access">
              Request Access
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Global Footer Info */}
        <footer className="mt-auto pt-xl flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="font-body-sm text-body-sm text-outline">© 2024 ECOFlow Systems Inc.</span>
          <div className="flex gap-lg">
            <a className="font-label-md text-label-md text-outline hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
            <a className="font-label-md text-label-md text-outline hover:text-on-surface transition-colors" href="#">System Status</a>
          </div>
        </footer>
      </section>
    </main>
  );
};

export default Login;
