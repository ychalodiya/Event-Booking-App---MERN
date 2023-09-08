import React from 'react';

import authContext from '../../context/auth-context';
import './EventItem.css';

export default function EventItem(props) {
  const { userID } = React.useContext(authContext);
  return (
    <li className='events-list-item' key={props.event.eventId}>
      <div>
        <h1>{props.event.title}</h1>
        <h2>${props.event.price} - {new Date(props.event.date).toLocaleDateString()}</h2>
      </div>
      <div>
        {userID === props.event.creator._id ?
          <p>You're the creator of this event</p> :
          <button className="btn" onClick={props.onDetail.bind(this, props.event._id)}>View Details</button>
        }

      </div>
    </li>
  )
}
