import React from 'react';
import { NavLink } from 'react-router-dom';

import authContext from '../../context/auth-context';
import './MainNavigation.css';

export default function MainNavigation() {
    const { token, logout } = React.useContext(authContext);

    return (
        <header className='main-navigation'>
            <div className='main-navigation__logo'>
                <h1>Regional Events</h1>
            </div>
            <nav className='main-navigation__items'>
                <ul>
                    {!token &&
                        <li>
                            <NavLink to="/auth">Authentication</NavLink>
                        </li>
                    }
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    {token &&
                        (<>
                            <li>
                                <NavLink to="/bookings">bookings</NavLink>
                            </li>
                            <li>
                                <NavLink to="/auth" onClick={logout}>logout</NavLink>
                            </li>
                        </>)
                    }
                </ul>
            </nav>
        </header>
    )
}
