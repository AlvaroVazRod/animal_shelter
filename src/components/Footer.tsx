import { Link, useNavigate } from "react-router-dom";
const Footer = () => {
   const navigate = useNavigate();
  return (
    <footer className="bg-[#f5f5f5] py-8 px-4 border-t-2 border-[#AD03CB]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1 - Sobre nosotros */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#AD03CB]">Protectora</h3>
            <p className="text-sm">
              Rescatando y dando amor a los peludos que más lo necesitan desde
              2010.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#AD03CB]">Enlaces</h3>
            <ul className="space-y-2">
              <li
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Link to="/" className="hover:text-[#AD03CB] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[#AD03CB] transition-colors"
                  to="/animales"
                  onClick={(e) => {
                    if (window.scrollY > 0) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setTimeout(() => {
                        navigate("/animales"); // Usa useNavigate de react-router-dom
                      }, 100); // Espera 500ms (ajusta según la duración de tu scroll)
                    }
                  }}
                >
                  Nuestros animales
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="hover:text-[#AD03CB] transition-colors"
                  onClick={(e) => {
                    if (window.scrollY > 0) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setTimeout(() => {
                        navigate("/contacto"); // Usa useNavigate de react-router-dom
                      }, 100); // Espera 500ms (ajusta según la duración de tu scroll)
                    }
                  }}
                >
                  Contacta con nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#AD03CB]">Contacto</h3>
            <address className="not-italic text-sm">
              <p>Avda. de la Cambra de Comerç</p>
              <p>43204 Reus, Tarragona</p>
              <p className="mt-2">Tel: +34 977 32 62 49</p>
              <p>Email: info@protectora.org</p>
            </address>
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="mt-8 pt-6 border-t border-[#AD03CB] text-center text-sm">
          <p>
            © {new Date().getFullYear()} Protectora de Animales. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
