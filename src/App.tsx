import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./pages/MainPage/MainPage";
import { UserProvider } from "./services/users/UserContext";

function App() {

  return (
    // Proveedores de contexto y peticiones
    <UserProvider>
      <Login/>
    </UserProvider>
  );
}

export default App;
