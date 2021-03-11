import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
	const baseUrl = 'https://react-hooks-49d7e-default-rtdb.firebaseio.com';
	const { onLoadIngredients } = props;
	const [filter, setFilter] = useState('');
	const filterRef = useRef();

	useEffect(() => {
		const timer = setTimeout(() => {
			if (filter === filterRef.current.value) {
				const query =
					filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
				fetch(baseUrl + '/ingredients.json' + query)
					.then(res => res.json())
					.then(resData => {
						let loadedIngredients = [];

						for (let key in resData) {
							loadedIngredients.push({
								id: key,
								title: resData[key].title,
								amount: resData[key].amount,
							});
						}
						onLoadIngredients(loadedIngredients);
					});
			}
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, [filter, onLoadIngredients, filterRef]);

	return (
		<section className="search">
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					<input
						type="text"
						ref={filterRef}
						value={filter}
						onChange={e => setFilter(e.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
