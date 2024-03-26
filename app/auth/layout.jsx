import AuthNavbar from "@/components/Navbar/AuthNavbar";
import Footer from "@/components/Footer/Footer"


export default function RootLayout({ children }) {
  return (
      <>
          <AuthNavbar />
          {children}
      </>
  );
}
