import { useState, useEffect } from 'react';

export function RatingCard({ show_id }: { show_id: string }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [count, setCount] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [openRatingSubmission, setOpenRatingSubmission] =
    useState<boolean>(false);

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
          <span className="stars" key={i} style={{ color: '#FFD700' }}>
            &#9733;
          </span>
        );
      } else if (i - rating < 1) {
        // Half star
        stars.push(
          <span className="stars" key={i} style={{ color: '#FFD700' }}>
            &#9734;
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span className="stars" key={i} style={{ color: '#CCCCCC' }}>
            &#9734;
          </span>
        );
      }
    }
    return stars;
  };

  ////////////////////////

  const SubmitRatingStars = ({
    onSubmit,
  }: {
    onSubmit: (rating: number) => void;
  }) => {
    const [userRating, setUserRating] = useState<number>(0); // Stores the user's selected rating

    // Handle star click
    const handleStarClick = (rating: number) => {
      setUserRating(rating);
      console.log('User selected rating:', rating); // For debugging
    };

    // Render interactive stars
    const renderInteractiveStars = (rating: number) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <span
            className="stars"
            key={i}
            style={{
              color: i <= rating ? '#FFD700' : '#CCCCCC',
            }}
            onClick={() => handleStarClick(i)} // Updates the selected rating
          >
            &#9733; {/* Star symbol */}
          </span>
        );
      }
      return stars;
    };

    return (
      <>
        <div className="ratings-card">
          <p>
            Click To Rate
            <br />
            {renderInteractiveStars(userRating)}
            <br />
          </p>
        </div>
        <button
          className="rating-btn"
          onClick={() => onSubmit(userRating)} // Calls the submit function with the selected rating
        >
          Submit Rating
        </button>
      </>
    );
  };

  ///////////////////////////////////////

  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <div
        className="ratings-card"
        onClick={() => setOpenRatingSubmission(!openRatingSubmission)}
      >
        <p>
          Total Ratings: <strong>{count}</strong>
          <br />
          {renderStars(average)}
          <br />
          <strong>Click To Rate</strong>
        </p>
      </div>{' '}
      {openRatingSubmission ? (
        <SubmitRatingStars onSubmit={() => setOpenRatingSubmission(false)} />
      ) : (
        <></>
      )}
    </>
  );
}
