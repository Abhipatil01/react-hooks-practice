import React, { useContext } from 'react';

import Auth from './components/Auth';
import Ingredients from './components/Ingredients/Ingredients';
import { AuthContext } from './context/auth-context';

const App = props => {
	const { isAuth } = useContext(AuthContext);

	return isAuth ? <Ingredients /> : <Auth />;
};

export default App;
