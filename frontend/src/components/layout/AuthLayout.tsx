import { Outlet, Link } from "react-router-dom";
import { Icon } from "../ui/Icon";

export function AuthLayout() {
  return (
    <div className="bg-gradient-mesh min-h-screen flex flex-col items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-1 bg-primary/20 pointer-events-none" />
      <main className="w-full max-w-[440px] flex flex-col items-center">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="task_alt" className="text-primary text-[40px]" filled />
            <h1 className="text-3xl font-bold text-primary tracking-tight">
              TASK MANAGER
            </h1>
          </div>
        </header>
        <Outlet />
      </main>
      <div className="fixed bottom-12 right-12 hidden md:block opacity-10 pointer-events-none rotate-12">
        <Icon name="check_circle" className="text-[120px] text-primary" />
      </div>
    </div>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  to,
}: {
  text: string;
  linkText: string;
  to: string;
}) {
  return (
    <footer className="mt-6 text-center">
      <p className="text-sm text-on-surface-variant">
        {text}{" "}
        <Link
          to={to}
          className="text-primary font-medium hover:underline decoration-2 underline-offset-4"
        >
          {linkText}
        </Link>
      </p>
    </footer>
  );
}
