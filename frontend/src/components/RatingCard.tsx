import { useState, useEffect } from 'react';
import { UserRating } from '../types/UserRating';
import { User, UserContext } from './AuthorizeView';
import React from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function submitRating(submission: UserRating) {
  fetch(`${API_URL}/Movies/AddRating`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: submission.user_id,
      show_id: submission.show_id,
      rating: submission.rating,
    }),
  })
    // .then((data) => {
    //   // handle success or error from the server
    //   console.log(data);
    //   if (data.ok) console.log('Rating Submitted!!');
    //   else console.log('something wrong with the data format.');
    // })
    .catch((error) => {
      // handle network error
      console.error(error);
      console.log(`couldnt access ${API_URL}/Movies/AddRating`);
    });
}

export function RatingCard({ show_id }: { show_id: string }) {
  const user: User = React.useContext(UserContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [thisUserId, setThisUserId] = useState<number>(0);
  const [average, setAverage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [openRatingSubmission, setOpenRatingSubmission] =
    useState<boolean>(false);
  const [waitingRating, awaitingWaitingRating] = useState<number>(0);
  const [newRating, setNewRating] = useState<UserRating>({
    user_id: 0,
    show_id: '',
    rating: 0,
  });

  if (user && user.appUserId) setThisUserId(user.appUserId);

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
            `Could not access ${API_URL}/Movies/GetAverageMovieRating/${show_id}`
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    setRefresh(false);
    awaitingWaitingRating(0);
    fetchRatings();
  }, [show_id, refresh]);

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
          <span className="stars" style={{ color: '#FFD700' }}>
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
      setNewRating({
        user_id: thisUserId,
        show_id: show_id,
        rating: rating,
      });
      // console.log(`You entered a rating of: ${rating}`);
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
            onClick={() => {
              awaitingWaitingRating(i);
              handleStarClick(i);
            }} // Updates the selected rating
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
            Rate Movie
            <br />
            {renderInteractiveStars(waitingRating)}
            <br />
          </p>
        </div>
        <button
          className="rating-btn"
          onClick={() => {
            setOpenRatingSubmission(!openRatingSubmission);
            renderInteractiveStars(0);
            try {
              submitRating(newRating);
              setRefresh(!refresh);
              setOpenRatingSubmission(false);
              // console.log(
              //   `I just submitted ${newRating.user_id}, ${newRating.show_id}, and ${newRating.rating}`
              // );
            } catch (e) {
              console.log(`This rating did not get submitted!: ${e}`);
            }
          }}
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
          Total Ratings:<strong> {count}</strong>
          <br />
          Average Rating:
          <strong> {average}</strong>
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
