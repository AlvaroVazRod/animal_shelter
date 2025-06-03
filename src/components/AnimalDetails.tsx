import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Animal } from "../types/Animals";
import { useNavigate } from "react-router-dom";
import { useUser } from "../services/users/useUser";
import { loadStripe } from "@stripe/stripe-js";
import { useSponsorCheckout } from "../services/stripe/useSponsorCheckout";

interface AnimalDetailsProps {
  animal: Animal;
  onClose: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export const AnimalDetails = ({ animal, onClose }: AnimalDetailsProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getToken } = useUser();
  const { createSponsorSession } = useSponsorCheckout();
  const [sponsorPrice, setSponsorPrice] = useState<number | null>(null);
  const [species, setSpecies] = useState("");
  const [gender, setGender] = useState("");
  const [arrivalFrom, setArrivalFrom] = useState("");
  const [arrivalTo, setArrivalTo] = useState("");

  const darkenHexColor = (hex: string, amount = 30) => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    let r = (num >> 16) - amount;
    let g = ((num >> 8) & 0x00ff) - amount;
    let b = (num & 0x0000ff) - amount;

    r = Math.max(0, r);
    g = Math.max(0, g);
    b = Math.max(0, b);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToRgba = (hex: string, alpha = 0.3) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  const handleAdopt = () => {
    const token = getToken();
    if (token) {
      navigate(`/adopt/${animal.id}`);
    } else {
      navigate("/login");
    }
  };

  const handleSponsor = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe no se cargó");
      return;
    }

    const sessionId = await createSponsorSession(animal.id);
    if (!sessionId) {
      alert("No se pudo iniciar el proceso de apadrinamiento.");
      return;
    }

    await stripe.redirectToCheckout({ sessionId });
  };

  useEffect(() => {
    const fetchSponsorPrice = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await fetch(
          `http://localhost:8080/api/animales/${animal.id}/sponsor-price`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error al obtener el precio");
        const price = await response.json();
        setSponsorPrice(price);
      } catch (error) {
        console.error("Error al cargar el precio de apadrinamiento:", error);
      }
    };
    if (animal?.id) fetchSponsorPrice();
  }, [animal]);

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl border-2 border-[#AD03CB] animate-fadeInScale"
      >
        <button
          className="absolute top-2 right-2 text-[#AD03CB] hover:text-[#7a0299] text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-extrabold mb-4 text-[#AD03CB] text-center">
          {animal.name}
        </h2>

        <div className="w-full h-48 rounded-xl mb-4 relative overflow-hidden bg-gray-200">
          {/* --- Fondo con blur --- */}
          <div className="absolute inset-0 z-0">
            <img
              src={`http://localhost:8080/images/animal/${animal.images?.[0]?.filename || animal.image
                }`}
              alt={`Fondo de ${animal.name}`}
              className="w-full h-full object-cover filter blur-md" // ¡Blur aplicado aquí!
            />
          </div>

          {/* --- Carrusel (imagen principal centrada) --- */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              loop
              className="w-full h-full"
            >
              {(animal.images ?? []).length > 0 ? (
                animal.images?.map((img, index) => (
                  <SwiperSlide
                    key={`${animal.id}-${index}`}
                    className="flex items-center justify-center h-full"
                  >
                    <img
                      src={`http://localhost:8080/images/animal/${img.filename}`}
                      alt={animal.name}
                      className="max-h-full max-w-full object-contain mx-auto shadow-lg"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide className="flex items-center justify-center h-full">
                  <img
                    src={`http://localhost:8080/images/animal/${animal.image}`}
                    alt={animal.name}
                    className="max-h-full max-w-full object-contain mx-auto shadow-lg"
                  />
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-y-2 text-sm text-gray-700">
            <div className="w-1/2">
              <span className="font-semibold text-[#AD03CB]">Edad:</span>{" "}
              {animal.age} {animal.age === 1 ? "año" : "años"}
            </div>
            <div className="w-1/2">
              <span className="font-semibold text-[#AD03CB]">Peso:</span>{" "}
              {animal.weight} Kg
            </div>
            <div className="w-1/2">
              <span className="font-semibold text-[#AD03CB]">Sexo:</span>{" "}
              {animal.gender}
            </div>
            <div className="w-1/2">
              <span className="font-semibold text-[#AD03CB]">Raza:</span>{" "}
              {animal.breed}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {animal.species.toLowerCase().includes("dog") && (
              <span className="bg-pink-100 text-[#AD03CB] text-xs font-semibold px-3 py-1 rounded-full animate-slide-in">
                🐶 Perro
              </span>
            )}
            {animal.species.toLowerCase().includes("cat") && (
              <span className="bg-pink-100 text-[#AD03CB] text-xs font-semibold px-3 py-1 rounded-full animate-slide-in">
                🐱 Gato
              </span>
            )}
            {animal.tags?.map((tag) => (
              <span
                key={tag.id}
                title={tag.description} // <-- Aquí agregamos el tooltip
                className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full animate-slide-in"
                style={{
                  backgroundColor: hexToRgba(tag.color, 0.4),
                  color: darkenHexColor(tag.color, 90),
                }}
              >
                {tag.icon && (
                  <img
                    src={`http://localhost:8080/tags/${tag.icon}`}
                    alt={tag.name + " icono"}
                    className="w-3 h-3"
                  />
                )}
                {tag.name}
              </span>
            ))}
          </div>

          <div className="text-center text-sm text-gray-600 mt-2">
            {sponsorPrice !== null && (
              <p>
                Apadrina a este animal por{" "}
                <span className="font-semibold text-[#AD03CB]">
                  {sponsorPrice.toFixed(2)} €/mes
                </span>
              </p>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={handleSponsor}
              className="bg-[#AD03CB] hover:bg-[#9202ad] text-white font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Apadrinar
            </button>
            <button
              onClick={handleAdopt}
              className="bg-[#AD03CB] hover:bg-[#9202ad] text-white font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Adóptame
            </button>
          </div>
        </div>

        <style>
          {`
            @keyframes fadeInScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fadeInScale {
              animation: fadeInScale 0.3s ease-out;
            }
          `}
        </style>
      </div>
    </div>
  );
};
