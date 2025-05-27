import Main from "../../components/Main";
import Navbar from "../../components/Navbar";
import { DefaultPageTemplate } from "../templates/DefaultTemplate";


export const Home = () => {

  return (
  <>
    <DefaultPageTemplate>
      <Main/>
    </DefaultPageTemplate>
  </>
  );
};
export default Home;