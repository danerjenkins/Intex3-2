// AdminPage.tsx
import React from 'react';
import { MovieDataCard } from '../components/MovieDataCard';

const dummyMovies = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  title: 'Movie',
  director: 'Director',
  info: 'Movie Information',
  posterUrl: '',
}));

const AdminPage: React.FC = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <div className="container py-4">
        <h2 className="text-center mb-4">Welcome Admin</h2>
        <div className="row">
          {/* Movie Cards */}
          <div className="col-md-9">
            <div className="row g-4">
              {dummyMovies.map((movie) => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={movie.id}>
                  <MovieDataCard
                    title={movie.title}
                    director={movie.director}
                    info={movie.info}
                    posterUrl={movie.posterUrl}
                    onEdit={() => alert(`Edit ${movie.id}`)}
                    onDelete={() => alert(`Delete ${movie.id}`)}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className="page-item disabled">
                  <a className="page-link">Previous</a>
                </li>
                <li className="page-item active">
                  <a className="page-link">1</a>
                </li>
                <li className="page-item">
                  <a className="page-link">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link">...</a>
                </li>
                <li className="page-item">
                  <a className="page-link">68</a>
                </li>
                <li className="page-item">
                  <a className="page-link">Next</a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Filter Sidebar */}
          <div className="col-md-3">
            <div className="bg-white p-3 rounded shadow-sm mb-4">
              <h5 className="mb-3">Filter Results</h5>
              <div className="mb-3">
                <label className="form-label">Label</label>
                <select className="form-select">
                  <option>Value</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="radioGroup"
                  />
                  <label className="form-check-label">Label</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="radioGroup"
                  />
                  <label className="form-check-label">Label</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="radioGroup"
                  />
                  <label className="form-check-label">Label</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="radioGroup"
                  />
                  <label className="form-check-label">Label</label>
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    Label
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Label</label>
                <input type="range" className="form-range" min="0" max="100" />
                <div className="d-flex justify-content-between">
                  <span>$0</span>
                  <span>$100</span>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2}></textarea>
              </div>

              <button className="btn btn-dark w-100">
                Add Movie to Database
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
