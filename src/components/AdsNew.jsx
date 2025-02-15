import { useEffect, useState } from 'react';
import { getCookies } from '../utils/cookies';

export const AsdNew = () => {
	const [validUser, setValidUser] = useState(false);
	const [categories, setCategories] = useState([]); // ✅ Исправлено
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0); // Храним индекс
	const [image, setImage] = useState(null);
	const [imageError, setImageError] = useState(''); 
	const token = getCookies('token');

	useEffect(() => {
		if (token) {
			const checkToken = async () => {
				const res = await fetch('http://127.0.0.1:8000/test_token/', {
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

	useEffect(() => {
		const getCategories = async () => {
			const res = await fetch('http://127.0.0.1:8000/categories/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Token ${token}`,
				},
			});
			if (res.ok) {
				const cats = await res.json();
				setCategories(cats);
			}
		};
		getCategories();
	}, [token]);

	const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Проверка типа файла
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setImageError('Допустимы только файлы формата PNG или JPG.');
                setImage(null);
                return;
            }

            // Проверка размера файла
            if (file.size > 2 * 1024 * 1024) {
                setImageError('Размер файла не должен превышать 2 MB.');
                setImage(null);
                return;
            }

            // Если всё ок, сохраняем файл
            setImageError(''); // Сбрасываем ошибку
            setImage(file);
        } else {
            setImageError('Пожалуйста, выберите файл.');
            setImage(null);
        }
    };
	const handleCategoryChange = (e) => {
		setSelectedCategoryIndex(e.target.value);
	};

	const handelSubmit = async () => {
		const formData = new FormData();

		formData.append('title', title);
		formData.append('description', description);
		formData.append('category', categories[selectedCategoryIndex]?.id);
		if (image) {
			formData.append('image', image);
		}
		const res = await fetch('http://127.0.0.1:8000/ads/', {
			method: 'POST',
			headers: {
				Authorization: `Token ${token}`,
			},
			body: formData,
		});

		if (res.ok) {
			alert('Объявление успешно добавленно');
			setDescription('');
			setTitle('');
			setImage(null);
			setSelectedCategoryIndex(0);
		} else if (res.status === 400) {
			alert('Что-то пошло не так, по пробуйте позже');
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				width: '100%',
				height: '100%',
			}}>
			{' '}
			{validUser ? (
				<>
					<h1>Создать новое объявление</h1>
					<input
						type="text"
						placeholder="Название объявления"
						value={title}
						onChange={(e) => setTitle(e.target.value)} // ✅ Добавлен обработчик
					/>
					<textarea
						placeholder="Описание объявления"
						value={description}
						onChange={(e) => setDescription(e.target.value)} // ✅ Добавлен обработчик
					/>
					<select
						value={selectedCategoryIndex}
						onChange={handleCategoryChange}>
						{categories.map((cat) => (
							<option
								key={cat.id}
								value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
					<input
						type="file" // ✅ Изменено с type="image"
						accept="image/*"
						onChange={handleImageChange} // ✅ Обработчик загрузки файла
					/>
                    <p>{"* только png или jpeg, размером  < 2mb"}</p>
					{imageError && <p style={{ color: 'red' }}>{imageError}</p>}
					<button onClick={handelSubmit}>Опубликовать</button>
				</>
			) : (
				<h1>Отказано в доступе</h1>
			)}
		</div>
	);
};
