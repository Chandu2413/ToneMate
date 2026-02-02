import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
