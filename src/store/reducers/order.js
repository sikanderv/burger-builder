import * as actionTypes from '../actions/actionTypes';
// import { updateObject } from '../utility';


const initialState = {
    orders: [],
    loading: false,
    checkedOut: false
};

const reducer = (state = initialState, action) => {

    // Evaluate actions
    switch (action.type) {

        case actionTypes.PURCHASE_INIT:
            return {
                ...state,
                checkedOut: false
            }

        case actionTypes.PURCHASE_BURGER_START:
            return {
                ...state,
                loading: true
            };
            
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder = {
                ...action.orderData,
                id: action.orderId
            };
            return {
                ...state,
                loading: false,
                checkedOut: true,
                orders: state.orders.concat(newOrder)
            };

        case actionTypes.PURCHASE_BURGER_FAIL:
            return {
                ...state,
                loading: false,
            };

        case actionTypes.FETCH_ORDERS_START:
            return {
                ...state,
                loading: true
            };

        case actionTypes.FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.orders,
                loading: false
            };

        case actionTypes.FETCH_ORDERS_FAIL:
            return {
                ...state,
                loading: false
            };

        default:
            return state;
    }
};

export default reducer;