import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    error: false,
    buildingBurger: false
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 1,
    bacon: 0.75,
    meat: 1.25
};

const reducer = (state = initialState, action) => {
    // Evaluate action types
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
                buildingBurger: true
            };

        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1,
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
                buildingBurger: true
            };

        case actionTypes.SET_INGREDIENTS:
            return {
                ...state,
                // ingredients: action.ingredients,
                // to ensure proper order of ings.
                ingredients: {
                    salad: action.ingredients.salad,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
                },
                totalPrice: 4,
                error: false,
                buildingBurger: false
            };

            case actionTypes.FETCH_INGREDIENTS_FAILED:
            return {
                ...state,
                error: true
            };

        default:
            return state;
    }
};

export default reducer;