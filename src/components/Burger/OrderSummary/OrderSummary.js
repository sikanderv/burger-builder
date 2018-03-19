import React, { Component } from 'react';

import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button'

// this could be a functional component as well
// was converted to class to check all the places the OrderSummary is getting updated
// so that its wrapper (Modal) could be made a class and 'shouldComponentUpdate' implemented in it
// to enhance performance
class OrderSummary extends Component {

    componentWillUpdate(){
        console.log('Inside [OrderSummary] componentWillUpdate');
    }

    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {this.props.ingredients[igKey]}
                </li>
            )
        });

        return (
            <Aux>
                <h3>Your Order</h3>
                <p>The following ingredients are in your order:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p><strong>Total Price</strong>: ${this.props.price.toFixed(2)}</p>
                <p>Continue to checkout?</p>
                <Button clicked={this.props.orderCanceled} btnType="Danger">CANCEL</Button>
                <Button clicked={this.props.orderConfirmed} btnType="Success">CONTINUE</Button>
            </Aux>
        );
    }

}

export default OrderSummary;