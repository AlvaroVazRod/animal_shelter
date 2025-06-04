import { useUser } from "../users/useUser";

export function useSponsorCheckout() {
  const { getToken } = useUser();

  const createSponsorSession = async (animalId: number): Promise<string | null> => {
    const token = getToken();
    console.log("Token usado para Stripe:", token);
    try {
      const response = await fetch(`http://localhost:8080/api/stripe/sponsor-checkout/${animalId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al crear sesión de Stripe");
      }

      const data = await response.json();
      return data.sessionId;
    } catch (error) {
      console.error("Fallo al iniciar sesión de Stripe:", error);
      return null;
    }
  };

  return { createSponsorSession };
}
