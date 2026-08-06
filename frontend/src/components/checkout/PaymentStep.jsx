import { useState } from "react";
import { FiMessageCircle, FiTruck } from "react-icons/fi";

export default function PaymentStep({ order, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePlaceOrder = () => {
    if (paymentMethod === "cod") {
      alert("Your Cash on Delivery order has been placed successfully.");
      onPaymentSuccess();
      return;
    }

    const phoneNumber = "9398865029"; 

    const message = `
🛍️ *New Order - Neela Jewellery*

Order Number: ${order.order_number}

Amount: ₹${order.total_amount}

Payment Method: WhatsApp Order

Please confirm my order.
`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    onPaymentSuccess();
  };

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-gold/20 bg-white p-8 shadow-sm">

      <h2 className="mb-2 text-center font-display text-3xl text-charcoal">
        Select Payment Method
      </h2>

      <p className="mb-8 text-center text-charcoal/60">
        Order <strong>{order.order_number}</strong>
      </p>

      <div className="mb-6 rounded-lg bg-cream p-5">
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="font-display text-2xl">
            ₹{order.total_amount}
          </span>
        </div>
      </div>

      {/* Cash on Delivery */}

      <label className="mb-4 flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-gold-dark">

        <input
          type="radio"
          checked={paymentMethod === "cod"}
          onChange={() => setPaymentMethod("cod")}
        />

        <FiTruck size={22} className="text-gold-dark" />

        <div>
          <h3 className="font-semibold">
            Cash on Delivery
          </h3>

          <p className="text-sm text-charcoal/60">
            Pay when your jewellery is delivered.
          </p>
        </div>

      </label>

      {/* WhatsApp */}

      <label className="mb-8 flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover:border-green-500">

        <input
          type="radio"
          checked={paymentMethod === "whatsapp"}
          onChange={() => setPaymentMethod("whatsapp")}
        />

        <FiMessageCircle
          size={22}
          className="text-green-600"
        />

        <div>

          <h3 className="font-semibold">
            Order via WhatsApp
          </h3>

          <p className="text-sm text-charcoal/60">
            Continue your order through WhatsApp.
          </p>

        </div>

      </label>

      <button
        onClick={handlePlaceOrder}
        className="w-full rounded-lg bg-gold-dark py-3 text-white transition hover:bg-charcoal"
      >
        {paymentMethod === "cod"
          ? "Place Cash on Delivery Order"
          : "Continue on WhatsApp"}
      </button>

    </div>
  );
}