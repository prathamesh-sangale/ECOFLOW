
import { Link } from 'react-router-dom';

const AccessPending = () => {
  return (
    <main className="relative w-full max-w-4xl flex flex-col items-center mx-auto py-xl">
      {/* Top Branding Anchor */}
      <div className="mb-xl text-center fade-in">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">ECOFlow</h1>
        <p className="font-label-md text-label-md text-outline uppercase tracking-widest mt-xs">Enterprise Management</p>
      </div>

      {/* Success/Confirmation Card */}
      <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.03)] p-lg md:p-xl fade-in overflow-hidden relative">
        {/* Subtle Background Texture */}
        <div className="absolute top-0 right-0 p-lg opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[120px]">task_alt</span>
        </div>

        <div className="flex flex-col md:flex-row gap-xl items-center relative z-10">
          {/* Illustration Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative group">
              {/* Animated Aura */}
              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700"></div>
              {/* Main Illustration Image */}
              <img 
                className="w-64 h-64 md:w-80 md:h-80 object-contain relative z-20 transition-transform duration-500 group-hover:scale-105" 
                alt="Illustration" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6bW2uE79gagIk7ivl6zTrNRLGu8sBm-BchzR9gQKEdiREbCVi27BLrRN0WR2MDl71_UaJhf8bSxyabedStZEu4MllncbAsZFEvaKt6llccfjy0DbBBlBDpgTchguL0aghWrw6tNYHAuNrKrr3DOzEbmFhlA9YMAphaiDUqlyWtYcCDveAna6OSyP0BXT-hjtIZbXy6yA-Zq8cDpepya19xlmWl8v3oeRAORkGDNFOLce-yzO9lqspywPQpAa1kBELRlBzdcM6PPJy"
              />
              {/* Floating Element */}
              <div className="absolute bottom-4 -right-4 bg-white p-md rounded-lg shadow-lg border border-outline-variant flex items-center gap-sm animate-bounce duration-[3000ms] z-30">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="font-label-md text-label-md font-bold">Reviewing</span>
              </div>
            </div>
          </div>

          {/* Text & Content Section */}
          <div className="w-full md:w-1/2 space-y-lg">
            <header className="space-y-sm">
              <div className="inline-flex items-center gap-sm bg-secondary-container text-on-secondary-container px-md py-xs rounded-full">
                <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                <span className="font-label-md text-label-md font-bold">Request Submitted</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Awaiting Administrator Approval</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Your application has been logged in our system. A manager from the engineering department will review your credentials within 24 hours.
              </p>
            </header>

            {/* Summary Box */}
            <div className="bg-surface-container-low rounded-lg p-md border border-outline-variant space-y-md">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-outline uppercase">Details Summary</span>
                <span className="font-body-sm text-body-sm text-primary font-medium">Ref: #PENDING</span>
              </div>
              <div className="grid grid-cols-1 gap-sm">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-outline">person</span>
                  <div>
                    <p className="font-label-md text-label-md text-outline">Status</p>
                    <p className="font-title-lg text-title-lg text-on-surface">Pending Verification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-md pt-md">
              <Link to="/" className="flex-1 bg-primary text-on-primary font-label-lg text-label-lg h-10 px-lg rounded-lg flex items-center justify-center gap-sm hover:bg-primary-container transition-all active:scale-95 duration-200">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Login
              </Link>
              <a className="flex-1 border border-outline text-on-surface-variant font-label-lg text-label-lg h-10 px-lg rounded-lg flex items-center justify-center gap-sm hover:bg-surface-container-high transition-all active:scale-95 duration-200" href="#">
                <span className="material-symbols-outlined">contact_support</span>
                Support Center
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Helper */}
      <footer className="mt-xl text-center fade-in opacity-60">
        <p className="font-body-sm text-body-sm text-outline">
          Having trouble? Contact the system administrator at <span className="text-primary font-medium cursor-pointer hover:underline">it.support@ecoflow.com</span>
        </p>
      </footer>
    </main>
  );
};

export default AccessPending;
