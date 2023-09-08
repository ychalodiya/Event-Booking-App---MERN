import React, { useEffect, useState } from 'react';
import './EventsPage.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import authContext from '../context/auth-context';
import EventList from '../components/Events/EventList';
import Spinner from '../components/Spinner/Spinner';

export default function EventsPage() {
  const [creatEvent, setCreateEvent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsData, setEventsData] = useState([])

  const titleRef = React.createRef();
  const priceRef = React.createRef();
  const dateRef = React.createRef();
  const descriptionRef = React.createRef();

  const { token, userID } = React.useContext(authContext);

  // Trigger fetchEvents during the initial load process
  useEffect(() => {
    fetchEvents()
  }, []);

  const createEventHandler = () => {
    setCreateEvent(!creatEvent);
  }

  const cancelEventHandler = () => {
    setCreateEvent(false);
    setSelectedEvent(null);
  }

  const confirmEventHandler = () => {
    setCreateEvent(false);
    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const description = descriptionRef.current.value;

    if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
        mutation CreateEvent($Title: String!, $Description: String!, $Price: Float!, $Date: String!) {
          createEvent (inputEvent: {title: $Title, description: $Description, price: $Price, date: $Date}) {
            _id
            title
            description
            price
            date
          }
        }
      `,
      variables: {
        Title: title,
        Description: description,
        Price: price,
        Date: date
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
        return setEventsData([...eventsData, {
          _id: res.data.createEvent._id,
          title: title,
          description: description,
          price: price,
          date: date,
          creator: {
            _id: userID
          }
        }]);
      })
      .catch(err => {
        console.log("error:", err);
      });
  }

  const showDetailHandler = (eventId) => {
    return setSelectedEvent(eventsData.find(e => e._id === eventId));
  }

  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent(null);
      return;
    }

    const requestBody = {
      query: `
        mutation BookEvent($EventId: ID!){
          bookEvent (eventId: $EventId) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        EventId: selectedEvent._id
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
        setSelectedEvent(null);
      })
      .catch(err => {
        console.log("error:", err);
      });
  }

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    }

    fetch(process.env.REACT_APP_API_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(res => {
        setEventsData(res.data.events);
        setIsLoading(false);
      })
      .catch(err => {
        console.log("error:", err);
        setIsLoading(false);
      });
  }

  return (
    <>
      {(creatEvent || selectedEvent) && <Backdrop />}
      {creatEvent &&
        <Modal
          title="Add Event"
          canCancel="true"
          canConfirm="true"
          onCancel={cancelEventHandler}
          onConfirm={confirmEventHandler}
          confirmText="Confirm">
          <form>
            <div className='form-control'>
              <label htmlFor='title'>Title</label>
              <input type="text" id="title" ref={titleRef} placeholder='Please, enter event title' />
            </div>
            <div className='form-control'>
              <label htmlFor='price'>Price</label>
              <input type="number" id="price" ref={priceRef} placeholder='Please, enter ticket price ' />
            </div>
            <div className='form-control'>
              <label htmlFor='date'>Date</label>
              <input type="datetime-local" id="date" ref={dateRef} />
            </div>
            <div className='form-control'>
              <label htmlFor='description'>Description</label>
              <textarea type="text" id="description" ref={descriptionRef} rows="4" placeholder='Please, enter ticket price ' />
            </div>
          </form>
        </Modal>
      }

      {selectedEvent &&
        <Modal
          title={selectedEvent.title}
          canCancel="true"
          canConfirm="true"
          onCancel={cancelEventHandler}
          onConfirm={bookEventHandler}
          confirmText={token ? "Book" : "Confirm"}>
          <form>
            <h1>{selectedEvent.title}</h1>
            <h2>${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
            <p>{selectedEvent.description}</p>
          </form>
        </Modal>
      }

      {token &&
        <div className='events-control'>
          <p>Share your own Events!</p>
          <button className='btn' onClick={createEventHandler}>Create Event</button>
        </div>
      }

      {isLoading
        ?
        <Spinner />
        :
        <EventList events={eventsData} onViewDetail={showDetailHandler} />
      }
    </>
  )
}
