
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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

          {/* Mock User Switcher */}
          <div className="space-y-md">
            <div className="p-4 bg-primary-container/20 rounded-xl border border-primary/20 mb-6">
              <p className="font-body-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                Development Mode: Select a role to log in automatically without a backend.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-sm">
              <button 
                onClick={async () => {
                  try {
                    await login('admin@ecoflow.com', 'Password123!');
                    navigate('/dashboard');
                  } catch (e) {
                    alert('Login failed. Ensure backend is running and seeded.');
                  }
                }}
                className="w-full h-14 bg-surface-container border border-outline-variant hover:border-primary hover:bg-primary/5 rounded-xl flex items-center justify-between px-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined">admin_panel_settings</span>
                  </div>
                  <div className="text-left">
                    <p className="font-label-lg text-on-surface">Admin</p>
                    <p className="font-body-sm text-on-surface-variant">System Configuration & Audit</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
              </button>

              <button 
                onClick={async () => {
                  try {
                    await login('engineer1@ecoflow.com', 'Password123!');
                    navigate('/dashboard');
                  } catch (e) {
                    alert('Login failed. Ensure backend is running and seeded.');
                  }
                }}
                className="w-full h-14 bg-surface-container border border-outline-variant hover:border-secondary hover:bg-secondary/5 rounded-xl flex items-center justify-between px-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined">engineering</span>
                  </div>
                  <div className="text-left">
                    <p className="font-label-lg text-on-surface">Engineer</p>
                    <p className="font-body-sm text-on-surface-variant">ECO Creation & BOMs</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary group-hover:translate-x-1 transition-all">arrow_forward</span>
              </button>

              <button 
                onClick={async () => {
                  try {
                    await login('approver@ecoflow.com', 'Password123!');
                    navigate('/dashboard');
                  } catch (e) {
                    alert('Login failed. Ensure backend is running and seeded.');
                  }
                }}
                className="w-full h-14 bg-surface-container border border-outline-variant hover:border-tertiary hover:bg-tertiary/5 rounded-xl flex items-center justify-between px-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                    <span className="material-symbols-outlined">fact_check</span>
                  </div>
                  <div className="text-left">
                    <p className="font-label-lg text-on-surface">Approver</p>
                    <p className="font-body-sm text-on-surface-variant">Review & Approval Queue</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-tertiary group-hover:translate-x-1 transition-all">arrow_forward</span>
              </button>

              <button 
                onClick={async () => {
                  try {
                    await login('production@ecoflow.com', 'Password123!');
                    navigate('/dashboard');
                  } catch (e) {
                    alert('Login failed. Ensure backend is running and seeded.');
                  }
                }}
                className="w-full h-14 bg-surface-container border border-outline-variant hover:border-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center justify-between px-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">precision_manufacturing</span>
                  </div>
                  <div className="text-left">
                    <p className="font-label-lg text-on-surface">Production</p>
                    <p className="font-body-sm text-on-surface-variant">Manufacturing Releases</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">arrow_forward</span>
              </button>
            </div>
          </div>

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
