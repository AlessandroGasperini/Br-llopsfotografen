import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Login';
import CreateAccount from './Pages/CreateAccount';
import GuestPage from './Pages/GuestPage';
import AdminPage from './Pages/AdminPage';


function App() {
  return (
    <div className="App">
      <Router>
        <main>
          <Link to="/"></Link>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />
            <Route path="/Guest" element={<GuestPage />} />
            <Route path="/Admin" element={<AdminPage />} />

          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;

