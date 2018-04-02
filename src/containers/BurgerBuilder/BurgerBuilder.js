import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import axios from '../../../src/axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

// connect react-redux store
import { connect } from 'react-redux';

// import * as actionTypes from '../../store/actions';
import * as actions from '../../store/actions/index';


class BurgerBuilder extends Component {

    // ingredients => name_of_ingredient: quantity
    state = {

        // for managing Modal state
        ordering: false,

        // PRE-REDUX
        // // for managing Spinner state
        // loading: false,
        // // for rendering error message if GET fails or any other runtime error
        // error: false
    };

    // Common lifecycle hook for fetching/sending data from and to the Internet
    componentDidMount() {
        // to check for history, location and match - ROUTING RELATED
        console.log(this.props);

        // PRE-REDUX
        // axios.get('https://react-burger-ed455.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({
        //             ingredients: response.data
        //         })
        //     }).catch(error => {
        //         this.setState({error: true});
        //     });

        // POST REDUX
        this.props.onInitIngredients();
    }

    // updatePurchaseState(ingredients) {

    //     const sum = Object.keys(ingredients)
    //         .map(igKey => {
    //             return ingredients[igKey];
    //         })
    //         .reduce((sum, el) => {
    //             return sum + el;
    //         }, 0);

    //     this.setState({ purchaseable: sum > 0 });
    // }

    orderHandler = () => {
        // Setting 'ordering' will decide whether to show the 'Purchase continue or cancel" modal or not
        // If user is  authenticated, show the modal otherwise redirect to "sign-in" page for sign-up
        if (this.props.isAuthenticated) {
            this.setState({
                ordering: true
            })            
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    orderCancelHandler = () => {
        this.setState({
            ordering: false
        })
    }

    orderConfirmHandler = () => {

        // PRE-REDUX
        // ROUTING RELATED - Section 12, Lecture 206
        // const queryParams = [];
        // for (let i in this.props.ings) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]))
        // };
        // // pus to Checkout  and from there to Contact Data
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });

        // POST REDUX
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
        
    }

    //  PRE-REDUX APPROACH TO MANAGE STATE
    // addIngredientHandler = (type) => {
    //     const updatedCountOfIngredients = this.props.ings[type] + 1;
    //     const updatedIngredients = { ...this.props.ings };
    //     // Replaced old count of ingredient selected with new count
    //     updatedIngredients[type] = updatedCountOfIngredients;
    //     // Add price of ingredient selected to current total price
    //     const newTotal = this.state.totalPrice + INGREDIENT_PRICES[type];
    //     // Mutate state
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newTotal
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // };

    //  PRE-REDUX APPROACH TO MANAGE STATE
    // removeIngredientHandler = (type) => {
    //     if (this.props.ings[type] <= 0) {
    //         return;
    //     }
    //     const updatedCountOfIngredients = this.props.ings[type] - 1;
    //     const updatedIngredients = { ...this.props.ings };
    //     // Replaced old count of ingredient selected with new count
    //     updatedIngredients[type] = updatedCountOfIngredients;
    //     // Add price of ingredient selected to current total price
    //     const newTotal = this.state.totalPrice - INGREDIENT_PRICES[type];
    //     // Mutate state
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newTotal
    //     });
    //     this.updatePurchaseState(updatedIngredients);

    // };

    render() {

        // Disable Less button if 0 quantity for ingredient type[s]
        const disabledInfo = {
            ...this.props.ings
        }

        for (let key in disabledInfo) {
            // return true or false based on value of key
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        
        // PRE-REDUX
        // while data is being posted
        // if (this.state.loading) {
        //     orderSummary = <Spinner />;
        // }

        let burger = this.props.error ? <p style={{ textAlign: 'center' }}>Error occurred while fetching ingredients data from Firebase</p> : <Spinner />;

        if (this.props.ings) {
            burger =
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        addIngredient={this.props.onIngredientAdded}
                        removeIngredient={this.props.onIngredientRemoved}
                        disabled={disabledInfo}

                        price={this.props.price}
                        purchaseable={this.props.purchasable}
                        isAuth={this.props.isAuthenticated}
                        ordered={this.orderHandler}
                    />
                </Aux>;

            console.log(this.props.price);
            orderSummary = <OrderSummary
                price={this.props.price}
                orderCanceled={this.orderCancelHandler}
                orderConfirmed={this.orderConfirmHandler}
                ingredients={this.props.ings} />;

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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        purchasable: state.burgerBuilder.totalPrice > 4,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));