import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { UserProvider } from "./services/users/UserContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRouter>
          <></>
        </AppRouter>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
