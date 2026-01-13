import "./App.css";
import Header from "./assets/components/Header";
import Footer from "./assets/components/Footer";
import Movies from "./assets/components/Movies/Movies";

function App() {
  return (
    <div className="app-container">
      
      <Header />

      <main className="main-content">
        <h1>Welcome to the Movie Review App</h1>
        <p>This is the main content area where movie listings or reviews will appear.</p>
        <Movies />
      </main>

      <Footer />

    </div>
  );
}

export default App;
