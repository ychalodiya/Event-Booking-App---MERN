import React from 'react';
import './BookingList.css';

export default function (props) {

    return (
        <ul className='booking__list'>
            {
                props.bookings.map(booking => {
                    return (<li key={booking._id} className='booking__list-item'>
                        <div>
                            {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                        </div>

                    </li>)
                })
            }
        </ul>
    )
}
