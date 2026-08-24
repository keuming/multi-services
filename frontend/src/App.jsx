import { Routes, Route } from "react-router-dom";
import { TopBar } from "./components/layout/TopBar";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { ServicesIndex } from "./pages/ServicesIndex";
import { CategoryPage } from "./pages/CategoryPage";
import { ListingDetail } from "./pages/ListingDetail";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesIndex />} />
          <Route path="/services/:slug" element={<CategoryPage />} />
          <Route path="/annonces/:id" element={<ListingDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
