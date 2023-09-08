import React from 'react';

import './BookingControls.css';

export default function BookingControls(props) {
    return (
        <div className='bookings-control'>
            <button className={props.activeViewType === 'list' ? 'active' : ''} onClick={props.onSwitchAction.bind(this, 'list')} id="list">List</button>
            <button className={props.activeViewType === 'chart' ? 'active' : ''} onClick={props.onSwitchAction.bind(this, 'chart')} id="chart">Chart</button>
        </div>
    )
}
