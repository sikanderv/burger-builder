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
        ingredients: null,
        // Base price with 0 ingredients
        totalPrice: 4,
        // for managing Purchase state - whether or not user can click on ORDER NOW button
        purchaseable: false,
        // for managing Modal state
        ordering: false,
        // for managing Spinner state
        loading: false,
        // for rendering error message if GET fails or any other runtime error
        error: false
    };

    // Common lifecycle hook for fetching/sending data from and to the Internet
    componentDidMount() {
        // to check for history, location and match - ROUTING RELATED
        console.log(this.props);

        axios.get('https://react-burger-ed455.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({
                    ingredients: response.data
                })
            }).catch(error => {
                this.setState({error: true});
            });
    }


    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);

        this.setState({ purchaseable: sum > 0 });
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
   
        // ROUTING RELATED - Section 12, Lecture 206
        const queryParams = [];
        for (let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        };
        // pus to Checkout  and from there to Contact Data
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
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

        let orderSummary = null;
        // while data is being posted
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        let burger = this.state.error ? <p style={{textAlign: 'center'}}>Error occurred while fetching ingredients data from Firebase</p> : <Spinner />;
        
        if (this.state.ingredients) {
            burger =
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        addIngredient={this.addIngredientHandler}
                        removeIngredient={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ordered={this.orderHandler}
                    />
                </Aux>;

            orderSummary = <OrderSummary
                price={this.state.totalPrice}
                orderCanceled={this.orderCancelHandler}
                orderConfirmed={this.orderConfirmHandler}
                ingredients={this.state.ingredients} />;

        };

        return (
            <Aux>
                <Modal show={this.state.ordering} modalClosed={this.orderCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);