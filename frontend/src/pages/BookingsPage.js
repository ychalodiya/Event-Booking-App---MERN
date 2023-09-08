import React, { useState, useContext, useEffect } from 'react';
import authContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList';
import BookingChart from '../components/Bookings/BookingChart';
import BookingControls from '../components/Bookings/BookingControls';

export default function BookingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingsData, setBookingsData] = useState([]);
  const { token } = useContext(authContext);
  const [currentView, setCurrentView] = useState('list');

  const onDeleteHandler = (bookingId) => {
    setIsLoading(true);

    const requestBody = {
      query: `
        mutation CancelBooking($ID: ID!){
          cancelBooking(bookingId: $ID) {
            _id
            title
          }
        }
      `,
      variables: {
        ID: bookingId
      }
    }

    fetch(process.env.REACT_APP_API_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(res => {
        const updatedBookings = bookingsData.filter(booking => booking._id !== bookingId);
        setBookingsData(updatedBookings);
        setIsLoading(false);
      })
      .catch(err => {
        console.log("Error: ", err);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
    }

    fetch(process.env.REACT_APP_API_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(res => {
        setBookingsData(res.data.bookings);
        setIsLoading(false);
      })
      .catch(err => {
        console.log("Error: ", err);
        setIsLoading(false);
      });
  }

  const switchViewHandler = (viewSelection) => {
    viewSelection === 'list' ? setCurrentView('list') : setCurrentView('chart');
  }

  let content = <Spinner />;

  if (!isLoading) {
    content = (
      <>
        <BookingControls onSwitchAction={switchViewHandler} activeViewType={currentView} />
        <div>
          {
            currentView === 'list'
              ?
              <BookingList bookings={bookingsData} onDelete={onDeleteHandler} />
              :
              <BookingChart bookings={bookingsData} />
          }

        </div>
      </>
    )
  }

  return (
    <div>
      {content}
    </div>
  )
}
