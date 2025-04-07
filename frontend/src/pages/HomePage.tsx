import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <Header />

      <div className="bg-danger text-white p-3 rounded mb-4">
        If this is red with padding, Bootstrap is working!
      </div>

      <div className="d-flex flex-column align-items-center mt-5 gap-3">
        <h1 className="display-4 fw-bold text-center">Welcome to CineNiche</h1>
        <div className="d-flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="btn btn-danger px-4"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-secondary px-4"
          >
            Register
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export { HomePage };
