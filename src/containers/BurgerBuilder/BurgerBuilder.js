import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {

    salad: 0.5,
    cheese: 1,
    bacon: 0.75,
    meat: 1.25

}

class BurgerBuilder extends Component {
    
    // ingredients => name_of_ingredient: quantity
    state = {
        ingredients: {
            salad: 0,
            cheese: 0,
            bacon: 0,
            meat: 0
        },
        // Base price with 0 ingredients
        totalPrice: 4,
        purchaseable: false,
        ordering: false
    };

    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
                    .map(igKey => {
                        return ingredients[igKey];
                    })
                    .reduce((sum, el) => {
                        return sum + el;
                    }, 0);

        this.setState({purchaseable: sum>0});
    }

    orderHandler = () => {
        this.setState({
            ordering: true
        })
    }

    orderCancelHandler = () => {
        this.setState({
            ordering: false
        })
    }

    orderConfirmHandler = () => {
        alert('Confirmration of order');
    }

    addIngredientHandler = (type) => {
        const updatedCountOfIngredients = this.state.ingredients[type] + 1;
        const updatedIngredients = { ...this.state.ingredients };
        // Replaced old count of ingredient selected with new count
        updatedIngredients[type] = updatedCountOfIngredients;
        // Add price of ingredient selected to current total price
        const newTotal = this.state.totalPrice + INGREDIENT_PRICES[type];
        // Mutate state
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newTotal
        });
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] <= 0) {
            return;
        }
        const updatedCountOfIngredients = this.state.ingredients[type] - 1;
        const updatedIngredients = { ...this.state.ingredients };
        // Replaced old count of ingredient selected with new count
        updatedIngredients[type] = updatedCountOfIngredients;
        // Add price of ingredient selected to current total price
        const newTotal = this.state.totalPrice - INGREDIENT_PRICES[type];
        // Mutate state
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newTotal
        });
        this.updatePurchaseState(updatedIngredients);

    };

    render() {

        // Disable Less button if 0 quantity for ingredient type[s]
        const disabledInfo = {
            ...this.state.ingredients
        }

        for (let key in disabledInfo) {
            // return true or false basedo on value of key
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return (
            <Aux>
                <Modal show={this.state.ordering} modalClosed={this.orderCancelHandler}>
                    <OrderSummary 
                        price={this.state.totalPrice}
                        orderCanceled={this.orderCancelHandler}
                        orderConfirmed={this.orderConfirmHandler}
                        ingredients={this.state.ingredients}/>
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    addIngredient={this.addIngredientHandler}
                    removeIngredient={this.removeIngredientHandler}
                    disabled={disabledInfo} 
                    price={this.state.totalPrice}
                    purchaseable={this.state.purchaseable}
                    ordered={this.orderHandler}
                    />
            </Aux>
        );
    }
}

export default BurgerBuilder;