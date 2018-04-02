import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import {withRouter} from 'react-router-dom';

const burger = (props) => {

    // log props to confirm there is NO access to match, location, and history 
    // console.log(props);

    // Step 1: Convert obj to array to be able to use .map
    // Step 2: Map each ingredient name (iKey = ingredient key) to return an empty array corresponding to its key's index
    // Ex: { salad: 3 } will return [ , , ]
    // Step 3: Map the new empty array to return a list of BurgerIngredient comps 
    // with unique key of "ingredient name + index" and type of ingredient name
    // Step 4: Reduce the final array of arrays (of objects) into a single array of objects
    let transformedIngredients = Object.keys(props.ingredients)
        .map(iKey => {
            return [...Array(props.ingredients[iKey])]
                .map((_, inx) => {
                    return <BurgerIngredient key={iKey + inx} type={iKey} />
                })
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Let's build your gourmet burger!</p>;
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom' />
        </div>
    );
};

export default withRouter(burger);