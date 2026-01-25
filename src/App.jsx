import Footer from "./Components/Footer/Footer";
import NavBar from "./Components/Header/NavBar";
import AppRoutes from "./util/AppRoutes";

function App() {
  return (
    <div>
      <NavBar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
