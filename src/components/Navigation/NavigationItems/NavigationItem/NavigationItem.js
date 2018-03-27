import React from 'react';
import classes from './NavigationItem.css'
import {NavLink} from 'react-router-dom';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <NavLink
            // class name is not required with NavLink
            // className={props.active ? classes.active : null}
            activeClassName={classes.active}
            exact={props.exact}
            to={props.link}>{props.children}
        </NavLink>
    </li>
);

export default navigationItem;