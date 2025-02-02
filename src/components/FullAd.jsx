import { useEffect, useState } from 'react';
import { redirect, useParams } from 'react-router';
import altImg from '../assets/i.jpg';
export const FullAd = () => {
	const { id } = useParams();
	const [ad, setAdd] = useState(null);

	useEffect(() => {
		const fetchAd = async () => {
			const response = await fetch(`http://127.0.0.1:8000/ads/all_ads/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();
			const needAdd = data.find((item) => item.id === parseInt(id));
			console.log(data);

			if (response.ok) {
				setAdd(needAdd);
			} else {
				setAdd(null);
				alert('Такого объявления нет');
				redirect('/');
			}
		};
		fetchAd();
	}, []);
	return (
		<div
			style={{
				margin: 10,
				padding: 10,
				border: '1px solid #ccc',
				borderRadius: 5,
			}}>
			{ad ? (
				<>
					<img
						src={ad.image ? ad.image : altImg}
						alt={ad.title}
						style={{ width: 400 }}
					/>
					<h3>{ad.title}</h3>
					<p>{ad.description}</p>
					<p>Автор: {ad.author}</p>
					<p>Опубликовано: {new Date(ad.create_at).toLocaleString('ru-RU')}</p>
				</>
			) : (
				<p>Загрузка...</p>
			)}
		</div>
	);
};
