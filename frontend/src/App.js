// src/App.js
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

// import bgImage from "./assets/bg-4.png";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden ">

      {/* Gradient Base */}
      <div/>

      {/* Background Image (Blurred) */}
    <div
  className="fixed inset-0 z-[-2]"
  style={{
    backgroundImage: `url(https://res.cloudinary.com/ddgbit2hg/image/upload/v1772142332/bg-4_w9crpg.png?auto=format,compress&w=1920)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "100% 100%",
  }}
/>

      {/* Soft Glass Overlay */}
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          backdropFilter: "blur(5px)",
          
        }}
      />

      {/* Main Layout */}
      <div className="relative min-h-screen flex flex-col">
        <Nav />

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
