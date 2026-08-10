import { Link } from "react-router-dom";
import logo from "../../assets/images/logo/logo-neela.jpeg";

export default function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center">
      <div className="overflow-hidden rounded-full">
        <img
          src={logo}
          alt="Neela Jewellery"
          className="
            h-10 w-10
            object-contain
            sm:h-12 sm:w-12
            lg:h-20 lg:w-20
          "
        />
      </div>
    </Link>
  );
}