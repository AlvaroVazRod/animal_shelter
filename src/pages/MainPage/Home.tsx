import Main from "../../components/Main";
import Navbar from "../../components/Navbar";
import AnimalsPage from "../../components/AnimalsPage";


export const Home = () => {
  return (<>
    <Navbar></Navbar>
    <div
      className="relative z-0 min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage: "url('./mainBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Main />
    </div>
    </>
  );
};
export default Home;
