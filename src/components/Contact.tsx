import { useState } from "react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData);
    alert("¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="relative bg-[#40170E] min-h-screen py-12 px-4 pt-8"
    style={{
        backgroundImage: "url('./mainBgBlur.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Contenedor principal */}
      <div className="max-w-6xl mx-auto pt-15">
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#40170E]">
          Contacta con nosotros
        </h1>

        {/* Grid con formulario y mapa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white p-8 rounded-lg shadow-xl col-span-full w-1/2 mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-[#D97236]">
              Envíanos un mensaje
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#40170E] mb-1"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#D97236] rounded-lg focus:ring-2 focus:ring-[#D97236] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#40170E] mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#D97236] rounded-lg focus:ring-2 focus:ring-[#D97236] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#40170E] mb-1"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#D97236] rounded-lg focus:ring-2 focus:ring-[#D97236] focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-[#D97236] hover:bg-[#BF5A2A] text-white font-bold rounded-lg transition duration-300 shadow-lg"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Mapa e información de contacto */}

          {/* Mapa */}
          <div className="h-96 rounded-lg overflow-hidden shadow-xl">
            <iframe
              title="Ubicación Protectora"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3028.215041820962!2d1.1062233154043932!3d41.15404697929862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a160e6a6b8a8a1%3A0x5a1a5a5a5a5a5a5a!2sAv.%20de%20Bellissens%2C%2040%2C%2043204%20Reus%2C%20Tarragona!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>

          {/* Información de contacto */}
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-2xl font-semibold mb-10 text-[#D97236]">
              Información de contacto
            </h2>
            <div className="flex align-content:center justify-center">
              <ul className="space-y-3 text-[#40170E]">
                <li>
                  <span className="mr-3 text-[#D97236]">📍</span>
                  <span>Av. de Bellissens, 40, 43204 Reus, Tarragona</span>
                </li>
                <li>
                  <span className="mr-3 text-[#D97236]">📞</span>
                  <span>+34 977 12 34 56</span>
                </li>
                <li>
                  <span className="mr-3 text-[#D97236]">✉️</span>
                  <span>info@protectorareus.org</span>
                </li>
                <li>
                  <span className="mr-3 text-[#D97236]">⏰</span>
                  <span>Lunes a Viernes: 10:00 - 18:00</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
