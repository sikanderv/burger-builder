import React from 'react';
import BuildControl from '../BuildControls/BuildControl/BuildControl';
import classes from './BuildControls.css'

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Meat', type: 'meat' },
    { label: 'Cheese', type: 'cheese' }
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p><strong>Total:</strong> ${props.price.toFixed(2)}</p>
        {controls.map(ctrl => (
            <BuildControl
                key={ctrl.label}
                label={ctrl.label}
                disabled={props.disabled[ctrl.type]}
                add={() => props.addIngredient(ctrl.type)}
                remove={() => props.removeIngredient(ctrl.type)} />
        ))}

        <button
            className={classes.OrderButton}
            disabled={!props.purchaseable}
            onClick={props.ordered}>{props.isAuth ? 'ORDER NOW' : 'SIGN IN TO ORDER'}</button>
    </div>
);

export default buildControls;