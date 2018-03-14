import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

    // Step 1: Convert obj to array to be able to use .map
    // Step 2: Map each ingredient name (key) to return an empty array corresponding to its key's value 
    // Ex: { salad: 3 } will return [ , , ]
    // Step 3: Map the new empty array to return a list of BurgerIngredient comps 
    // with unique key of "ingredient name + index" and type of ingredient name
    const transformedIngredients =  Object.keys(props.ingredients)
                                .map(iKey => {
                                    return [...Array(props.ingredients.iKey)]
                                .map((_, inx) => {
                                    return <BurgerIngredient key={iKey + inx} type={iKey}/>
                                    })
                                });

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom'/>
        </div>
    );
};

export default burger;