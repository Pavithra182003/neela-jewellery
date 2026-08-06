import api from "./api";

export const paymentService = {
  createRazorpayOrder: (orderNumber) =>
    api.post("/payments/create/", { order_number: orderNumber }).then((res) => res.data),
  verifyPayment: (payload) => api.post("/payments/verify/", payload).then((res) => res.data),
};

let razorpayScriptPromise = null;

/**
 * Lazily loads the Razorpay Checkout script exactly once, no matter
 * how many times this is called across the app.
 */
export function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script."));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

/**
 * Opens the Razorpay Checkout widget for a given NEELA order and
 * resolves once the payment has been verified server-side. Rejects on
 * verification failure or if the user closes the widget.
 */
export async function openRazorpayCheckout(orderNumber) {
  await loadRazorpayScript();
  const session = await paymentService.createRazorpayOrder(orderNumber);

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: session.razorpay_key_id,
      amount: session.amount,
      currency: session.currency,
      name: session.name,
      order_id: session.razorpay_order_id,
      prefill: session.prefill,
      theme: { color: "#A9814A" },
      handler: async (response) => {
        try {
          const payment = await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(payment);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("cancelled")),
      },
    });

    razorpay.on("payment.failed", () => reject(new Error("payment_failed")));
    razorpay.open();
  });
}
