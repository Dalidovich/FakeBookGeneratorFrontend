import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FakeBooksPage } from "./pages/FakeBooks";
import './App.css'

export default function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FakeBooksPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}