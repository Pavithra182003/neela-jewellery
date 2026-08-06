import { Link } from "react-router-dom";
import logo from "../../assets/images/logo/logo-neela.jpeg";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <div className="rounded-full overflow-hidden">
        <img
          src={logo}
          alt="Neela Jewellery"
          className="h-20 w-20 object-contain"
        />
      </div>
    </Link>
  );
}