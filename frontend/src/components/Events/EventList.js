import React from 'react';
import EventItem from './EventItem';
import './EventList.css'

export default function EventList(props) {
    const events = props.events;

    return (
        <>
            <ul className='event-list'>
                {
                    events.map(event => {
                        return <EventItem event={event} key={event._id} onDetail={props.onViewDetail} />
                    })
                }
            </ul>
        </>
    )
}
