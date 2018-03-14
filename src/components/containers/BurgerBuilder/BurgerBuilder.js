import React, { Component } from 'react';
import Aux from '../../../hoc/Auxiliary';

import Burger from '../../Burger/Burger';

class BurgerBuilder extends Component {
    
    // ingredients => name_of_ingredient: quantity
    state = {
        ingredients: {
            salad: 1,
            cheese: 2,
            bacon: 1,
            meat: 2
        }
    };

    render() {
        return (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <div>Build Controls</div>
            </Aux>
        );
    }
}

export default BurgerBuilder;