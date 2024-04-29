"use client";
import AuthNavbar from "@/components/Navbar/AuthNavbar";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/Footer/Footer"


export default function RootLayout({ children }) {
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      redirect("/userdashboard");
    }
  }, []);

  return (
    <>
      <AuthNavbar />
      {children}
      <Footer/>
    </>
  );
}
