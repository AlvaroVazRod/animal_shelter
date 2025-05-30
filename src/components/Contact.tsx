import { useState } from "react";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";

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
    console.log("Formulario enviado:", formData);
    alert("¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <DefaultPageTemplate>
      <section className="relative bg-[#f5f5f5] min-h-screen py-12 px-4 pt-8">
        <div className="max-w-6xl mx-auto pt-15">
          <h1 className="text-4xl md:text-4xl font-bold text-center mb-12 text-[#AD03CB]">
            Contacta con nosotros
          </h1>

          {/* Contenedor FLEX */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Formulario */}
            <div className="bg-neutral-900 p-10 rounded-2xl shadow-lg flex-1 text-white max-w-lg mx-auto">
              <h2 className="text-2xl font-bold mb-2">Envíanos un mensaje</h2>

              <p className="text-sm text-neutral-400 mb-8">
                Completa el formulario y te responderemos pronto.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1 text-neutral-300"
                  >
                    Nombre
                  </label>

                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3">
                    <FaUser className="text-neutral-400 mr-2" />

                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      className="w-full py-3 bg-transparent focus:outline-none text-white placeholder-neutral-500"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-neutral-300"
                  >
                    Email
                  </label>

                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg px-3">
                    <FaEnvelope className="text-neutral-400 mr-2" />

                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      required
                      className="w-full py-3 bg-transparent focus:outline-none text-white placeholder-neutral-500"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1 text-neutral-300"
                  >
                    Mensaje
                  </label>

                  <div className="flex items-start bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
                    <FaCommentDots className="text-neutral-400 mt-2 mr-2" />

                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Escribe tu mensaje..."
                      required
                      className="w-full bg-transparent focus:outline-none text-white placeholder-neutral-500 resize-none"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-300"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>

            {/* Mapa e información */}
            <div className="flex flex-col gap-6 flex-1">
              {/* Mapa */}
              <div className="h-64 lg:h-96 rounded-lg overflow-hidden shadow-xl">
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

              {/* Información */}
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <h2 className="text-2xl font-semibold mb-6 text-[#D97236]">
                  Información de contacto
                </h2>
                <ul className="space-y-3 text-[#40170E]">
                  <li>
                    <span className="mr-3 text-[#D97236]">📍</span>
                    Av. de Bellissens, 40, 43204 Reus, Tarragona
                  </li>
                  <li>
                    <span className="mr-3 text-[#D97236]">📞</span>
                    +34 977 12 34 56
                  </li>
                  <li>
                    <span className="mr-3 text-[#D97236]">✉️</span>
                    info@protectorareus.org
                  </li>
                  <li>
                    <span className="mr-3 text-[#D97236]">⏰</span>
                    Lunes a Viernes: 10:00 - 18:00
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultPageTemplate>
  );
};

export default Contact;
