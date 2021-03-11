import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from '../Ingredients/IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (curIngredientsState, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [...curIngredientsState, action.ingredients];
		case 'DELETE':
			return curIngredientsState.filter(
				ingredient => ingredient.id !== action.id
			);
		default:
			throw Error('ingredientReducer failed!');
	}
};

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case 'SEND':
			return { isLoading: true, error: null };
		case 'RESPONSE':
			return { ...curHttpState, isLoading: false };
		case 'ERROR':
			return { isLoading: false, error: action.error };
		case 'CLEAR':
			return { ...curHttpState, error: null };
		default:
			throw Error('httpReducer failed!');
	}
};

const Ingredients = () => {
	const baseUrl = 'https://react-hooks-49d7e-default-rtdb.firebaseio.com';
	const [ingredients, dispatchIngredient] = useReducer(ingredientReducer, []);
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
	});
	// const [ingredients, setIngredients] = useState([]);
	// const [isLoading, setLoading] = useState(false);
	// const [error, setError] = useState();

	useEffect(() => {
		console.log('Rendering Ingredients', ingredients);
	}, [ingredients]);

	const filterIngredientsHandler = useCallback(filteredIngredients => {
		// setIngredients(filteredIngredients);
		dispatchIngredient({ type: 'SET', ingredients: filteredIngredients });
	}, []);

	const addIngredientHandler = ingredient => {
		// setLoading(true);
		dispatchHttp({ type: 'SEND' });
		fetch(baseUrl + '/ingredients.json', {
			method: 'POST',
			body: JSON.stringify(ingredient),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then(resData => {
				// setLoading(false);
				// setIngredients(prevState => [
				// 	...prevState,
				// 	{
				// 		id: resData.name,
				// 		...ingredient,
				// 	},
				// ]);
				dispatchHttp({ type: 'RESPONSE' });
				dispatchIngredient({
					type: 'ADD',
					ingredients: {
						id: resData.name,
						...ingredient,
					},
				});
			});
	};

	const removeIngredientHandler = ingredientId => {
		// setLoading(true);
		dispatchHttp({ type: 'SEND' });
		fetch(baseUrl + `/ingredients/${ingredientId}.json`, {
			method: 'DELETE',
		})
			.then(res => {
				// setLoading(false);
				// setIngredients(prevState =>
				// 	prevState.filter(ingredient => ingredient.id !== ingredientId)
				// );
				dispatchHttp({ type: 'RESPONSE' });
				dispatchIngredient({ type: 'DELETE', id: ingredientId });
			})
			.catch(e => {
				dispatchHttp({ type: 'ERROR', error: e.message });
				// setLoading(false);
				// setError(e.message);
			});
	};

	const clearError = () => {
		// setError(null);
		dispatchHttp({ type: 'CLEAR' });
	};

	return (
		<div className="App">
			{httpState.error && (
				<ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
			)}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				isLoading={httpState.isLoading}
			/>

			<section>
				<Search onLoadIngredients={filterIngredientsHandler} />
				<IngredientList
					ingredients={ingredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
