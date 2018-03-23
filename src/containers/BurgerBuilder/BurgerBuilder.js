import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import axios from '../../../src/axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

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
        // for managing Purchase state - whether or not user can click on ORDER NOW button
        purchaseable: false,
        // for managing Modal state
        ordering: false,
        // for managing Spinner state
        loading: false
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
        // switch state of loading
        this.setState({
            loading: true
        })

        // build the order object
        // sidenote: in production db, price should be calculated on the server always
        // no that user cannot manipulate it in any way
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            // these 2 properties will be built in later modules such as checkout
            customer: {
                name: 'Max Schwarmuller',
                address: {
                    street: 'Test street 1',
                    zipCode: '41321',
                    country: 'Bozoland'
                },
                email: 'tests@test.com'
            },
            deliveryMethod: 'fastest'
        }

     
        // Post order to firebase
        // the below stmnt will create a new 'child node' in the mongodb-like db of firebase
        // '.json' is required only for firebase db - not any others        
        axios.post('/orders.json', order)
            .then( response => {
                // Due to async nature, as data is already posted, switch state back to false 
                // to stop spinner and remove Modal (ordering)
                this.setState({ loading: false, ordering: false})
            })
            .catch(error => {
                // Due to async nature, as data is already posted, switch state back to false 
                // to stop spinner and remove Modal (ordering)
                this.setState({ loading: false, ordering: false})
            });
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
            // return true or false based on value of key
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = <OrderSummary 
                            price={this.state.totalPrice}
                            orderCanceled={this.orderCancelHandler}
                            orderConfirmed={this.orderConfirmHandler}
                            ingredients={this.state.ingredients}/>;
                            
        // while data is being posted
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }
        return (
            <Aux>
                <Modal show={this.state.ordering} modalClosed={this.orderCancelHandler}>
                    {orderSummary}
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

export default withErrorHandler(BurgerBuilder, axios);