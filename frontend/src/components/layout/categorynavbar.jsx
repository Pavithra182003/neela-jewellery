import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function CategoryNavbar() {
  return (
    <div className="hidden lg:block border-y border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <ul className="flex justify-center items-center gap-10 py-4 uppercase text-sm font-medium tracking-wider">

          <li>
            <Link to="/" className="hover:text-gold-dark transition">
              Home
            </Link>
          </li>

          <li>
            <Link to="/category/necklace" className="hover:text-gold-dark transition">
              Necklace
            </Link>
          </li>

          <li>
            <Link to="/category/bracelets" className="hover:text-gold-dark transition">
              Bracelets
            </Link>
          </li>

          <li>
            <Link to="/category/earrings" className="hover:text-gold-dark transition">
              Earrings
            </Link>
          </li>

          <li>
            <Link to="/category/anklets" className="hover:text-gold-dark transition">
              Anklets
            </Link>
          </li>

          <li>
            <Link to="/category/bangles" className="hover:text-gold-dark transition">
              Bangles
            </Link>
          </li>

          <li>
            <Link to="/category/finger-rings" className="hover:text-gold-dark transition">
              Finger Rings
            </Link>
          </li>

          <li className="relative group py-3">
          <button className="flex items-center gap-1 hover:text-gold-dark transition">
            Other
            <FiChevronDown size={15} />
          </button>

          <div className="absolute left-0 top-full z-50 hidden min-w-[220px] rounded-md border border-gray-200 bg-white shadow-lg group-hover:block">
            <Link
              to="/category/waist-chain"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Waist Chain
            </Link>

            <Link
              to="/category/combo-sets"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Combo Sets
            </Link>

            <Link
              to="/category/nose-pins"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Nose Pins
            </Link>

            <Link
              to="/category/toe-rings"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Toe Rings
            </Link>

            <Link
              to="/category/brooches"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Brooches
            </Link>

            <Link
              to="/category/hair-accessories"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Hair Accessories
            </Link>

            <Link
              to="/category/pendants"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Pendants
            </Link>

            <Link
              to="/category/gift-sets"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
            >
              Gift Sets
            </Link>
          </div>
        </li>

        </ul>
      </div>
    </div>
  );
}