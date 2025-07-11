import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

// Map titles to lucide icons
const iconMap = {
    Inventory: BookOpen,
    Reports: PieChart,
    Libraries: Settings2,
};

const data = {
    user: {
        name: "Supply Officer",
        email: "supply@region10.dost.gov.ph",
        avatar: "",
    },
    teams: [
        {
            name: "ISPMS",
            logo: GalleryVerticalEnd,
            plan: "DOST 10",
        },
    ],
    navMain: [
        {
            title: "Inventory",
            url: "#",
            icon: iconMap["Inventory"],
            isActive: true,
            items: [
                { title: "Stock In", url: "/inventory/stock-in" },
                { title: "Requests", url: "/inventory/requests" },
                { title: "Items", url: "/inventory/items" },
            ],
        },
        {
            title: "Reports",
            url: "#",
            icon: iconMap["Reports"],
            isActive: true,
            items: [
                { title: "RIS", url: "/reports/ris" },
                { title: "RSMI", url: "/reports/rsmi" },
            ],
        },
        {
            title: "Libraries",
            url: "#",
            icon: iconMap["Libraries"],
            isActive: true,
            items: [
                { title: "Unit of Measure", url: "/libraries/uom" },
                { title: "Emp RIS No", url: "/libraries/risno" },
            ],
        },
    ],
};

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="bg-primary text-primary-foreground">
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent className="bg-primary text-primary-foreground">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="bg-primary text-primary-foreground">
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
