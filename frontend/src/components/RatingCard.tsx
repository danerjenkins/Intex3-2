import { useState, useEffect } from 'react';
import { UserRating } from '../types/UserRating';

export function RatingCard({ show_id }: { show_id: string }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [count, setCount] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [openRatingSubmission, setOpenRatingSubmission] =
    useState<boolean>(false);
  const [newRating, setNewRating] = useState<UserRating>({
    user_id: 0,
    show_id: '',
    rating: 0,
  });

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

  /////////// This is to show the stars for average movie rating
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

  ////////////////////////This is for the stars that the user submits as a rating

  const SubmitRatingStars = () => {
    // Handle star click
    const handleStarClick = (rating: number) => {
      setNewRating({ user_id: 0, show_id: show_id, rating: rating });
      console.log(`You entered a rating of: ${rating}`);
      console.log(`You have entered a rating of: ${newRating.rating}`);
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
            {renderInteractiveStars(newRating.rating)}
            <br />
          </p>
        </div>
        <button
          className="rating-btn"
          onClick={() => setOpenRatingSubmission(false)} // Calls the submit function with the selected rating
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
      {openRatingSubmission ? <SubmitRatingStars /> : <></>}
    </>
  );
}
