import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../components/common/Container";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import AddressStep from "../components/checkout/AddressStep";
import ReviewStep from "../components/checkout/ReviewStep";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, loading, hasUnavailableItems, clearCart } = useCart();

  const [step, setStep] = useState("Address");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    if (!loading && (!cart || cart.items.length === 0)) {
      navigate("/cart", { replace: true });
    }
  }, [loading, cart, navigate]);

  if (loading || !cart || cart.items.length === 0) {
    return (
      <Container className="py-16">
        <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-lg bg-charcoal/5" />
      </Container>
    );
  }

  const handleOrderPlaced = async (order) => {
    await clearCart();
    navigate(`/order-success/${order.order_number}`);
  };

  return (
    <Container className="py-12">
      <h1 className="mb-2 text-center font-display text-3xl text-charcoal">
        Checkout
      </h1>

      <CheckoutSteps currentStep={step} />

      {hasUnavailableItems && step === "Address" && (
        <div className="mx-auto mb-8 max-w-2xl rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          Some items in your cart exceed available stock. Please return to your
          cart and adjust quantities.
        </div>
      )}

      {step === "Address" && (
        <AddressStep
          selectedAddressId={selectedAddressId}
          onSelect={setSelectedAddressId}
          onContinue={() => setStep("Review")}
        />
      )}

      {step === "Review" && (
        <ReviewStep
          cart={cart}
          selectedAddressId={selectedAddressId}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={setAppliedCoupon}
          onRemoveCoupon={() => setAppliedCoupon(null)}
          onEditAddress={() => setStep("Address")}
          onOrderPlaced={handleOrderPlaced}
        />
      )}
    </Container>
  );
}