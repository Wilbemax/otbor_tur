import { useEffect, useState } from 'react';
import altImg from '../assets/i.jpg'; // Запасное изображение
import { Link } from 'react-router';

export const Asd = () => {
	const [ads, setAds] = useState([]);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const fetchAds = async () => {
			const response = await fetch('http://127.0.0.1:8000/ads/all_ads');
			const data = await response.json();
			setAds(data);
		};
		fetchAds();
	}, []);
    console.log(ads);
    
	return (
		<div
			style={{
				margin: '5rem auto',
				maxWidth: '100%',
				padding: '1rem',
				borderRadius: 5,
			}}>
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
					.filter(
						(item) => item.title.includes(search) && item.status === 'active'
					)
					.map((item) => (
						<>
							<div
								style={{
									textDecoration: 'none',
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
								<Link
									to={`/ads/${item.id}`}
									key={item.id}>
									<button>Подробнее</button>
								</Link>
							</div>
						</>
					))}
			</div>
		</div>
	);
};
