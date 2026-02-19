import { RouterProvider } from "react-router";
import { router } from "./routes/index";
import "./assets/scss/all.scss";
import MessageToast from "./components/MessageToast";

function App() {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
