'use client'
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer"
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }) {

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      redirect("/userdashboard");
    } else {
      console.log("No Token");
    }
  }, []);

  return (
      <>
          <Navbar />
          {children}
          <Footer/>
      </>
  );
}
