import { useEffect, useState } from 'react';
import { getCookies } from '../utils/cookies';

export const Categories = () => {
	const [validUser, setValidUser] = useState(false);
	const [cats, setCats] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editCategory, setEditCategory] = useState({ id: null, name: '' });
	const [newCat, setNewCat] = useState('');
	const token = getCookies('token');

	// Проверка токена
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

	// Получение списка категорий
	const fetchCats = async () => {
		const response = await fetch('http://127.0.0.1:8000/categories/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
		});
		const data = await response.json();
		if (!response.ok) {
			setValidUser(false);
		}
		setCats(data);
	};

	useEffect(() => {
		fetchCats();
	}, []);

	const cutDel = async (id) => {
		const res = await fetch(`http://127.0.0.1:8000/categories/${id}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
		});

		if (res.ok) {
			setCats(cats.filter((cat) => cat.id !== id));
		} else {
			console.error('Не удалось удалить категорию');
		}
	};

	const startEditing = (cat) => {
		setIsEditing(true);
		setEditCategory({ id: cat.id, name: cat.name });
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch(
			`http://127.0.0.1:8000/categories/${editCategory.id}/`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify({
					name: editCategory.name,
				}),
			}
		);

		if (res.ok) {
			const updatedCategory = await res.json();
			setCats(
				cats.map((cat) =>
					cat.id === updatedCategory.id ? updatedCategory : cat
				)
			);
			setIsEditing(false);
			setEditCategory({ id: null, name: '' });
		} else {
			console.error('Не удалось обновить категорию');
		}
	};

	const handleAdd = async () => {
		const res = await fetch('http://127.0.0.1:8000/categories/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Token ${token}`,
			},
			body: JSON.stringify({
				name: newCat,
			}),
		});

		if (res.ok) {
			fetchCats();
			setNewCat('');
		} else {
			alert('Произошла ошибка, по пробуйте позже');
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
				<div>
					{isEditing ? (
						<form onSubmit={handleEditSubmit}>
							<h2>Редактировать категорию</h2>
							<input
								type="text"
								value={editCategory.name}
								onChange={(e) =>
									setEditCategory({ ...editCategory, name: e.target.value })
								}
							/>
							<button type="submit">Сохранить</button>
							<button
								type="button"
								onClick={() => setIsEditing(false)}>
								Отменить
							</button>
						</form>
					) : (
						<>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
									marginBottom: '1rem',
								}}>
								{cats.map((cat) => (
									<div
										key={cat.id}
										style={{
											border: '1px solid #000',
											width: 400,
											padding: '1rem',
											borderRadius: 5,
										}}>
										<div>{cat.name}</div>
										<button onClick={() => startEditing(cat)}>
											Редактировать
										</button>
										<button onClick={() => cutDel(cat.id)}>Удалить</button>
									</div>
								))}
							</div>
							<div>
								<input
									type="text"
									placeholder="Добавить новую категорию"
									onChange={(e) => setNewCat(e.target.value)}
								/>
								<button onClick={handleAdd}>Добавить</button>
							</div>
						</>
					)}
				</div>
			) : (
				<h1>Отказано в доступе</h1>
			)}
		</div>
	);
};
