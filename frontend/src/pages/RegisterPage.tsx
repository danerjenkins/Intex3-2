import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

function Register() {
  // state variables for email and passwords
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [registering, setRegistering] = useState<boolean>(false);

  // state variable for error messages
  const [error, setError] = useState('');

  const handleLoginClick = () => {
    navigate('/login');
  };

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // handle submit event for the form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegistering(true);
    // validate email and passwords
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      // clear error message
      setError('');
      // post data to the /register api
      fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      })
        .then((data) => {
          if (data.ok) console.log('Successful registration. Please log in.');
          // get user in the database
          fetch(`${apiUrl}/Movies/RegisterUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: 0,
              name: '',
              phone: '',
              email: email,
              age: 0,
              gender: '',
              netflix: false,
              amazon_Prime: false,
              disney: false,
              paramount: false,
              max: false,
              hulu: false,
              apple_TV: false,
              peacock: false,
              city: '',
              state: '',
              zip: 0,
            }),
          })
            //.then((response) => response.json())
            .then((data) => {
              // handle success or error from the server
              if (data.ok) console.log('important one works :)');
              else setError('Error registering in movies database.');
            })
            .catch((error) => {
              // handle network error
              console.error(error);
              setError('Error registering.');
            });
        })
        .catch((error) => {
          // handle network error
          console.error(error);
          setError('Error registering.');
        });
    }
    setRegistering(false);
  };

  return (
    <>
      <Header />
      {registering && (
        <div className="text-center">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Registering ...</span>
          </div>
          <p>Registering ...</p>
        </div>
      )}
      <div className="container">
        <div className="row">
          <div className="card border-0 shadow rounded-3 ">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Register
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Email address.</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                </div>

                <div className="d-grid mb-2">
                  <button
                    className="btn btn-primary text-uppercase fw-bold"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
                <div className="d-grid mb-2">
                  <button
                    className="btn btn-primary text-uppercase fw-bold"
                    onClick={handleLoginClick}
                  >
                    Go to Login
                  </button>
                </div>
              </form>
              <strong>{error && <p className="error">{error}</p>}</strong>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
