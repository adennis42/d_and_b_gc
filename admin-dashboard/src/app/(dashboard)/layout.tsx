import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { signOut } from '@/lib/auth';
import { LayoutDashboard, FolderKanban, BarChart3, Settings, LogOut, User, Megaphone } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                <NavLink href="/projects" icon={FolderKanban}>
                  Projects
                </NavLink>
                <NavLink href="/banners" icon={Megaphone}>
                  Banners
                </NavLink>
                <NavLink href="/analytics" icon={BarChart3}>
                  Analytics
                </NavLink>
                <NavLink href="/settings" icon={Settings}>
                  Settings
                </NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">
                  {session.user?.email}
                </span>
              </div>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ 
  href, 
  icon: Icon, 
  children 
}: { 
  href: string; 
  icon: React.ComponentType<{ className?: string }>; 
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/80 transition-all duration-200"
    >
      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
      <span>{children}</span>
    </Link>
  );
}

