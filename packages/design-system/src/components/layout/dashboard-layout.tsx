"use client";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import React, { useState } from "react";
import { SideBar } from "../shared/dashboard-screen";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [isExpand, setIsExpand] = useState(true);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: isExpand ? 268 : 88,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="xl">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          LOLO
        </Group>
      </AppShell.Header>
      <AppShell.Navbar withBorder={false}>
        <SideBar isExpand={isExpand} setIsExpand={setIsExpand} />
      </AppShell.Navbar>
      <AppShell.Main className="bg-gray-50 w-screen h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-blue-50 scrollbar-track-transparent">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
