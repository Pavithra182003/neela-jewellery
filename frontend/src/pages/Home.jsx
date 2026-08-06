import { useCallback } from "react";
import Hero from "../components/home/Hero";
import FeaturedCategories from "../components/home/FeaturedCategories";
import ProductSection from "../components/home/ProductSection";
import ShopByCollection from "../components/home/ShopByCollection";
import BestsellerCarousel from "../components/home/BestsellerCarousel";
import WhyChooseNeela from "../components/home/WhyChooseNeela";
import Testimonials from "../components/home/Testimonials";
import InstagramGallery from "../components/home/InstagramGallery";
import Newsletter from "../components/home/Newsletter";
import { productService } from "../services/productService";

export default function Home() {
  // Stable references so ProductSection's effect doesn't refetch on
  // every render.
  const fetchFeatured = useCallback(() => productService.getFeatured(), []);
   
  return (
    <>
      {/* 1. Announcement bar + 2/3. Navbar + nav are rendered by Layout,
          Hero opts them into transparent/glass mode via useTransparentHeader() */}
      <Hero />

      {/* 4. Featured Categories */}
      <FeaturedCategories />

      {/* 5. Featured Products */}
      <ProductSection
        eyebrow="HAND-SELECTED"
        title="Featured Products"
        fetcher={fetchFeatured}
        viewAllLink="/shop?is_featured=true"
      />

      {/* 6. Shop by Collection */}
      <ShopByCollection />

      {/* 7. Bestseller Carousel */}
      <BestsellerCarousel />

      {/* 8. Why Choose Us */}
      <WhyChooseNeela />

      {/* 9. Testimonials */}
      <Testimonials />

      {/* 10. Instagram Gallery */}
      <InstagramGallery />

      {/* 11. Newsletter */}
      <Newsletter />

      {/* 12. Footer is rendered by Layout */}
    </>
    
  );
}
