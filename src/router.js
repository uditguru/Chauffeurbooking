import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './App';
import Booking from './booking';
import { createBrowserHistory } from "history"

const history = createBrowserHistory();

function Routes() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        let user = localStorage.getItem('user');
        user = JSON.parse(user)
        console.log(user)
        setUser(user);
    }, []);
    return (
        <div>
            <Router history={history}>
                {
                    user ? (
                        <h3> Hello,{user.name}</h3>
                    ) : (
                            <h5>Hello, Guest</h5>
                        )
                }
                <Route path="/" exact component={App} />
                <Route path="/booking" component={Booking} />
            </Router>
        </div>
    )
}

export default Routes;