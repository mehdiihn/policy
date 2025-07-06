"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, Shield, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  action?: () => void;
}

interface MobileNavProps {
  userRole?: string;
}

export function MobileNav({ userRole }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Debug logging
  console.log("MobileNav - userRole:", userRole);
  console.log("MobileNav - pathname:", pathname);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/user",
      icon: Home,
      roles: ["user"],
    },
    {
      label: "Admin",
      href: "/admin",
      icon: Shield,
      roles: ["admin"],
    },
    {
      label: "Sub-Admin",
      href: "/sub-admin",
      icon: FileText,
      roles: ["sub-admin"],
    },
    {
      label: "FAQ",
      href: "/user/faq",
      icon: HelpCircle,
      roles: ["user"],
    },
    {
      label: "Logout",
      href: "",
      icon: LogOut,
      roles: ["user", "admin", "sub-admin"],
      action: handleLogout,
    },
  ];

  // Filter items based on user role
  const filteredItems = navItems.filter((item) => {
    if (!userRole) return false;
    return item.roles?.includes(userRole);
  });

  // Debug logging
  console.log(
    "MobileNav - filteredItems:",
    filteredItems.map((item) => ({ label: item.label, roles: item.roles }))
  );

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100vw', background: '#fff', borderTop: '1px solid #e6e9eb', zIndex: 9999, boxShadow: '0 -2px 16px 0 rgba(37,99,235,0.10)', paddingBottom: 'env(safe-area-inset-bottom, 0)', pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 64, padding: '0 8px' }}>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" &&
              item.href !== "" &&
              pathname.startsWith(item.href));
          return (
            <button
              key={`${item.href}-${item.label}`}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  router.push(item.href);
                }
              }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 12, padding: '8px 16px', background: isActive ? '#2563eb11' : 'transparent', color: item.label === 'Logout' ? '#FF3B30' : isActive ? '#2563eb' : '#b9c4c9', fontWeight: 500, fontSize: 13, border: 'none', outline: 'none', transition: 'background .2s, color .2s', boxShadow: isActive ? '0 2px 8px #2563eb11' : 'none', minWidth: 60, cursor: 'pointer'
              }}
            >
              <Icon style={{ width: 22, height: 22, color: item.label === 'Logout' ? '#FF3B30' : isActive ? '#2563eb' : '#b9c4c9', marginBottom: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
