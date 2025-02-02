import { useEffect, useState } from 'react';
import { getCookies } from '../utils/cookies';
import altImg from '../assets/i.jpg';

export const AsdMe = () => {
	const [validUser, setValidUser] = useState(false);
	const [ads, setAds] = useState([]);
	const [search, setSearch] = useState('');
	const token = getCookies('token');

	useEffect(() => {
		if (token) {
			const checkToken = async () => {
				const res = await fetch('http://127.0.0.1:8000/test_token', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Token ${token}`,
					},
				});

				if (res.ok) {
					setValidUser(true);
				}
			};
			checkToken();
		}
	}, [token]);
	const fetchAds = async () => {
		const response = await fetch('http://127.0.0.1:8000/ads', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
		});
		const data = await response.json();
		setAds(data);
	};
	useEffect(() => {
		fetchAds();
	}, []);

	const changeStatus = async (status, item) => {
		const response = await fetch(`http://127.0.0.1:8000/ads/${item.id}/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
			body: JSON.stringify({
				title: item.title,
				category: item.category,
				description: item.description,
				status: status,
			}),
		});
		if (response.ok) {
			alert('Объявление успешно измененно');
            fetchAds();
		} else {
			alert('Ошибка, по пробуйте пожзже');
		}
	};

	return (
		<div
			style={{
				margin: '5rem auto',
				maxWidth: '100%',
				padding: '1rem',
				borderRadius: 5,
			}}>
			{validUser ? (
				<>
					<div>
						<input
							type="text"
							placeholder="Найти объявление"
							onChange={(e) => setSearch(e.target.value)}
							value={search}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
						}}>
						{ads
							.filter((item) => item.title.includes(search))
							.map((item) => (
								<div
									key={item.id}
									style={{
										margin: 10,
										padding: 10,
										border: '1px solid #ccc',
										borderRadius: 5,
									}}>
									<img
										src={item.image ? item.image : altImg}
										alt={item.title}
										style={{ width: 250 }}
									/>
									<h3>{item.title}</h3>
									<p>{item.description}</p>
									<p>Автор: {item.author}</p>
									<p>
										Опубликовано:{' '}
										{new Date(item.create_at).toLocaleString('ru-RU')}
									</p>
									<p>
										Статус:{' '}
										{item.status === 'active' ? 'активно' : 'не активно'}
									</p>
									<button
										onClick={() =>
											changeStatus(
												item.status === 'active' ? 'inactive' : 'active',
												item
											)
										}>
										{item.status === 'active'
											? 'Деактивировать'
											: 'Активировать'}
									</button>
								</div>
							))}
					</div>
				</>
			) : (
				<h1>Отказанно в доступе</h1>
			)}
		</div>
	);
};
