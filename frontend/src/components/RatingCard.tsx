import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function RatingCard({ show_id }: { show_id: string }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [count, setCount] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response1 = await fetch(
          `${API_URL}/Movies/GetAverageMovieRating/${show_id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(
          `my url: ${API_URL}/Movies/GetAverageMovieRating/${show_id}`
        );
        const response2 = await fetch(
          `${API_URL}/Movies/GetCountMovieRating/${show_id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response1.ok && response2.ok) {
          const data1 = await response1.json();
          const data2 = await response2.json();

          setAverage(data1);
          setCount(data2);
        } else {
          throw new Error(
            `HTTP error! Status: ${response1.status}, ${response2.status}`
          );
        }
      } catch (e) {
        console.error('Failed to fetch ratings:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [show_id]);

  // Helper to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Full star
        stars.push(
          <span key={i} style={{ color: '#FFD700', fontSize: '2rem' }}>
            &#9733;
          </span>
        );
      } else if (i - rating < 1) {
        // Half star
        stars.push(
          <span key={i} style={{ color: '#FFD700', fontSize: '2rem' }}>
            &#9734;
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={i} style={{ color: '#CCCCCC', fontSize: '2rem' }}>
            &#9734;
          </span>
        );
      }
    }
    return stars;
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div
      className="ratings-card"
      style={{
        zIndex: 9999,
        position: 'relative',
        alignSelf: 'flex-end',
        width: '20%',
        background: '#f8f9fa',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        fontSize: '16px',
      }}
      onClick={() => navigate('/')}
    >
      <p>
        Total Ratings: <strong>{count}</strong>
        <br />
        {renderStars(average)}
        <br />
        <strong>Click To Rate</strong>
      </p>
    </div>
  );
}
