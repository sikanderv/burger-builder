import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';

import { connect } from 'react-redux';


class Checkout extends Component {


    // PRE-REDUX
    // state = {
    //     ingredients: null,
    //     price: 0
    // }

    // PRE-REDUX
    // componentWillMount() {
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = 0;
    //     for (let param of query.entries()){
    //         // ['salad', '1']
    //         if (param[0] === 'price') {
    //             price = param[1];
    //         } else {
    //             ingredients[param[0]] = +param[1]; // adding + here converts param to number
    //         }

    //     }

    //     this.setState({ingredients: ingredients, totalPrice: price});
    // }


    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    };

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    };

    render() {
        let summary = <Redirect to="/" />;
        if (this.props.ings) {
            const checkoutRedirect = this.props.checkedOut ? <Redirect to="/" /> : null;
            summary = (
                <div>
                    {checkoutRedirect}
                    <CheckoutSummary
                        // Pre-redux
                        // ingredients={this.state.ingredients}
                        ingredients={this.props.ings}
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler} />

                    <Route
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData}
                    // the following "trick" was commented post redux (Lecture 262, 4:01) and the above line uncommented
                    // render={(props) => (
                    //     <ContactData 
                    //         ingredients={this.state.ingredients} 
                    //         price={this.state.totalPrice} 
                    //         {...props}/>)}
                    />
                </div>
            );
        }
        return summary;
    }
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        // Commented after inserting component={ContactData} in <Route> above
        // price: state.totalPrice

        // to handle redirect after checkout
        checkedOut: state.order.checkedOut
    }
}

// NO NEED FOR THIS AS THERE IS NO DISPATCH ACTION IN THIS COMPONENT (find out why)  
// const mapDispatchToProps = dispatch => {
//     return {

//     }
// }

export default connect(mapStateToProps)(Checkout);