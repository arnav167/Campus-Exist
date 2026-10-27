
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { GraduationCap, LogOut, UserCircle2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "./nav-items";
import { supabase } from "@/lib/supabase";

export function AppShell({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (mounted && !error) {
        setCurrentUser(data.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setCurrentUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    setIsLoggingOut(false);

    if (error) {
      console.error("Unable to sign out:", error.message);
      alert("Logout failed. Please try again.");
      return;
    }

    setCurrentUser(null);
  };

  const accountName =
    currentUser?.user_metadata?.full_name ||
    currentUser?.user_metadata?.name ||
    currentUser?.email?.split("@")[0] ||
    "Student";

  return (
    <div className="app-shell min-h-screen bg-background pb-20 md:pb-0">
      <header className="app-header sticky top-0 z-30 border-b bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
          {/* CampusExist branding */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 font-semibold text-foreground"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:-rotate-6">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>

            <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
              Campus<span className="text-primary">Exist</span>
            </span>
          </Link>

          {/* Desktop top navigation — preserved */}
          <nav
            aria-label="Main"
            className="ml-3 hidden items-center gap-1 lg:flex"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{
                  className: "bg-primary/10 text-primary",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Account details and authentication */}
          <div className="ml-auto flex items-center gap-2">
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  aria-label="View account details"
                  className="flex max-w-[15rem] items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-muted sm:px-3"
                >
                  <UserCircle2
                    className="h-6 w-6 shrink-0 text-primary"
                    aria-hidden
                  />

                  <span className="hidden min-w-0 text-left sm:block">
                    <span className="block text-xs font-medium text-muted-foreground">
                      Account Details
                    </span>

                    <span className="block truncate text-sm font-bold text-foreground">
                      {accountName}
                    </span>

                    {currentUser.email && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {currentUser.email}
                      </span>
                    )}
                  </span>
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="rounded-full px-3 font-semibold sm:px-4"
                >
                  <LogOut className="mr-1.5 h-4 w-4" aria-hidden />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  aria-label="Profile"
                  className="rounded-xl"
                >
                  <Link to="/profile">
                    <UserCircle2 className="h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="rounded-full px-4 font-bold shadow-sm shadow-primary/15"
                >
                  <Link to="/auth">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page content — preserved */}
      <main className="app-main mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-9">
        {children}
      </main>

      {/* Mobile bottom navigation — preserved */}
      <nav
        aria-label="Mobile"
        className="mobile-nav fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t bg-card/95 backdrop-blur-xl lg:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex min-w-0 flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium text-muted-foreground transition-colors sm:text-[11px]"
            activeProps={{ className: "text-primary font-bold" }}
          >
            <item.icon className="h-5 w-5" aria-hidden />
            <span className="max-w-full truncate">
              {item.label.split(" ")[0]}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
