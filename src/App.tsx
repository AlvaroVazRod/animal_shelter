import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { UserProvider } from "./services/users/UserContext";

function App() {
  return (
      <UserProvider>
        <AppRouter>
          <></>
        </AppRouter>
      </UserProvider>
  );
}

export default App;
