'use client'
import  UserNavbar from "@/components/Navbar/UserNavbar";
import Footer from "@/components/Footer/Footer"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";


export default function RootLayout({ children }) {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      redirect("/");
    } else {
      try {
        const decodedToken = jwt.decode(token);
        if (decodedToken) {
          setUsername(decodedToken.username);
        } else {
          // Handle invalid or expired token
          localStorage.removeItem("token");
          redirect("/");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle decoding error
        localStorage.removeItem("token");
        redirect("/");
      }
    }
  }, []);
  return (
      <>
          <UserNavbar username={username}/>
          {children}
          <Footer/>
      </>
  );
}
