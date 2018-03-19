import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.css'

const logo = (props) => (
    // style is only  used in Toolbar.js - not in SideDrawer.js
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={burgerLogo} alt="My Burger"/>
    </div>
);

export default logo;