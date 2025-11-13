"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tag, HardDrive } from "lucide-react";

const menuItems = [
  {
    href: "/dashboard",
    label: "My Tags",
    icon: Tag,
  },
  {
    href: "/dashboard/devices",
    label: "Devices",
    icon: HardDrive,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="border-r bg-card text-card-foreground">
      <SidebarContent>
        <SidebarHeader className="h-16" />
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href}
                  onClick={() => setOpenMobile(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
