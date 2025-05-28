import React, { useState } from "react";
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
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: finalAmount }),
    });

    const session = await res.json();

    if (stripe && session.id) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      alert("Hubo un error al procesar tu donación.");
    }
  };

  return (
    <DefaultPageTemplate>
      <div
        className="relative z-0 min-h-screen bg-cover bg-center px-4"
        style={{
          backgroundImage: "url('./mainBgBlur.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-[#40170E]">
          <div className="relative z-10 max-w-md w-full bg-[#F2DCB3]/90 p-8 rounded-lg shadow-lg border-2 border-[#A65638]">
            <h2 className="text-4xl font-bold mb-8 text-center">Haz una Donación</h2>

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
                      ? "bg-[#D97236] text-white"
                      : "bg-[#F2DCB3]"
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
                className="bg-[#40170E] text-white px-6 py-3 rounded-full font-bold hover:bg-[#D97236] transition-all"
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
