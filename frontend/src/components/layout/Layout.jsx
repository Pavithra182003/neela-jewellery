import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full max-w-none flex-col overflow-x-hidden bg-cream">
      <Navbar />

      <main className="w-full max-w-none min-w-0 flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}