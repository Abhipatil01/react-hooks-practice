import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from '../Ingredients/IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
	const baseUrl = 'https://react-hooks-49d7e-default-rtdb.firebaseio.com';
	const [ingredients, setIngredients] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		console.log('Rendering Ingredients', ingredients);
	}, [ingredients]);

	const filterIngredientsHandler = useCallback(filteredIngredients => {
		setIngredients(filteredIngredients);
	}, []);

	const addIngredientHandler = ingredient => {
		setLoading(true);
		fetch(baseUrl + '/ingredients.json', {
			method: 'POST',
			body: JSON.stringify(ingredient),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(res => res.json())
			.then(resData => {
				setLoading(false);
				setIngredients(prevState => [
					...prevState,
					{
						id: resData.name,
						...ingredient,
					},
				]);
			});
	};

	const removeIngredientHandler = ingredientId => {
		setLoading(true);
		fetch(baseUrl + `/ingredients/${ingredientId}.json`, {
			method: 'DELETE',
		})
			.then(res => {
				setLoading(false);
				setIngredients(prevState =>
					prevState.filter(ingredient => ingredient.id !== ingredientId)
				);
			})
			.catch(e => {
				setLoading(false);
				setError(e.message);
			});
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<div className="App">
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				isLoading={isLoading}
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
