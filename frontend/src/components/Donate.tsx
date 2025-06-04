import  { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const predefinedAmounts = [5, 10, 20, 50, 100];

export const Donate = () => {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const handleDonate = async () => {
    const finalAmount = amount ?? parseFloat(customAmount);

    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert("Por favor, introduce una cantidad válida.");
      return;
    }

    const stripe = await stripePromise;
    const res = await fetch("http://localhost:8080/api/donaciones/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: finalAmount,
        success_url: window.location.origin + "/success",
        cancel_url: window.location.origin + "/cancel",
      }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // <-- captura error del backend si existe
      console.error("Stripe error:", errorText);
      alert("Hubo un error al procesar tu donación.");
      return;
    }

    const session = await res.json();

    if (stripe && session.id) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      alert("Hubo un error al procesar tu donación.");
    }
  };

  return (
    <DefaultPageTemplate>
      <div className="bg-white min-h-screen bg-cover bg-center flex items-center justify-center pt-[10px] sm:pt-0">
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[#AD03CB]">
          <div className="relative z-10 max-w-md w-full bg-white/90 p-8 rounded-lg shadow-lg border-2 border-[#AD03CB]">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Haz una Donación
            </h2>

            <div className="flex flex-wrap gap-4 justify-center mb-6">
              {predefinedAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount("");
                  }}
                  className={`px-6 py-2 rounded-full font-semibold border ${
                    amount === value
                      ? "bg-[#AD03CB] text-white"
                      : "bg-[#F6F0FA]"
                  } transition-all hover:scale-105`}
                >
                  {value}€
                </button>
              ))}
            </div>

            <div className="mb-6 text-center">
              <input
                type="number"
                placeholder="Cantidad personalizada (€)"
                value={customAmount}
                min={0}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount(null);
                }}
                className="px-4 py-2 rounded-md border text-center"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleDonate}
                className="bg-[#AD03CB] text-white px-6 py-3 rounded-full font-bold hover:bg-[#eed4ff] transition-all"
              >
                Donar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageTemplate>
  );
};

export default Donate;
