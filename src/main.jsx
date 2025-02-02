import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { FullAd } from './components/FullAd.jsx';
import { AuthPage } from './components/AuthPage.jsx';
import { Asd } from './components/Ads.jsx';
import { AsdMe } from './components/AdsMe.jsx';
import { AsdNew } from './components/AdsNew.jsx';
import { Logout } from './components/Logout.jsx';
import './App.css';
import { Categories } from './components/Categories.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<AuthPage />}
				/>
				<Route
					path="/ads"
					element={<Asd />}
				/>
        <Route
					path="/category"
					element={<Categories />}
				/>
				<Route
					path="/ads/me"
					element={<AsdMe />}
				/>
				<Route
					path="/ads/new"
					element={<AsdNew />}
				/>
				<Route
					path="/logout"
					element={<Logout />}
				/>
				<Route
					path="ads/:id"
					element={<FullAd />}
				/>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
