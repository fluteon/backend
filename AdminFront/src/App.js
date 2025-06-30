import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminPannel from "./Admin/AdminPannel";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<AdminPannel />} />
    </Routes>
  );
}

export default App;
