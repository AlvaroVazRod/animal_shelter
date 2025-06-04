import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";

const ShelterPage = () => {
  return (
    <DefaultPageTemplate>
      <section className="relative bg-[#f5f5f5] min-h-screen py-12 px-4 pt-8">
        <div className="max-w-6xl mx-auto pt-15">
          <h1 className="text-4xl md:text-4xl font-bold text-center mb-12 text-[#AD03CB]">
            Sobre el Shelter
          </h1>

          <div className="relative p-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#AD03CB] mb-4">
              Nuestra historia
            </h2>
            <p className="text-[#AD03CB] mb-4">
              Desde 2010, nuestra misión es rescatar, proteger y encontrar hogares amorosos para animales que han sido abandonados o maltratados.
              Cada peludo que llega a nuestro refugio es tratado con amor, cuidado médico y atención personalizada.
            </p>

            <p className="text-[#AD03CB] mb-4">
              Gracias al trabajo de voluntarios y donaciones de personas como tú, hemos logrado salvar más de 1.500 vidas peludas.
            </p>

            <h2 className="text-xl font-semibold text-[#AD03CB] mt-6 mb-2">¿Cómo puedes ayudar?</h2>
            <ul className="list-disc list-inside text-[#40170E] text-md">
              <li>Adopta o apadrina un peludo</li>
              <li>Haz una donación para alimentación o cuidados médicos</li>
              <li>Únete como voluntario en eventos y actividades</li>
            </ul>

            <p className="mt-6 text-[#AD03CB]">
              ¡Gracias por formar parte de esta gran familia protectora! 🐾
            </p>
          </div>
        </div>
      </section>
    </DefaultPageTemplate>
  );
};

export default ShelterPage;
