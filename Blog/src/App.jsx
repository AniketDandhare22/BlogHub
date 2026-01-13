import { Routes, Route } from "react-router-dom";
import Home from "./home";
import SignUp from "./signUp";
import Error from "./error";
import Detail from "./detail";
import Settings from "./Settings";
import Create from "./CreatePost";
import Price from "./Pricing";
import ProtectedRoute from "./routes/protectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutUs from "./AboutUs";

function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<SignUp />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="*" element={<Error />} />
      <Route path="/detail/:id" element={<Detail />}/>

      <Route path="/settings" element={<Settings />}/>

      <Route
        path="/createPost"
        element={
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        }
      />

      <Route
        path="/price"
        element={
          <ProtectedRoute>
            <Price />
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  );
}

export default App;
