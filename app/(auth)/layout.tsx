"use client";
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: any) => state.authentication);
  if (user) redirect("/");
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-auth-dark bg-cover bg-center">
      {children}
    </main>
  );
};

export default Layout;
