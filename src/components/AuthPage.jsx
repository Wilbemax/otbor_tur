import { useEffect, useState } from 'react';
import { getCookies, setCookies } from '../utils/cookies';
import { Link } from 'react-router';

export const AuthPage = () => {
	const [validUser, setValidUser] = useState(false);
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		const token = getCookies('token');

		if (token) {
			const checkToken = async () => {
				const res = await fetch(' http://127.0.0.1:8000/test_token', {
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						Authorization: `Token ${token}`,
					},
				});

				if (res.ok) {
					setValidUser(true);
				}
			};
			checkToken();
		}
	}, []);

	const handelLogin = async () => {
		if (email.trim().length > 0 && password.trim().length > 0) {
			const res = await fetch(' http://127.0.0.1:8000/login/', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					username: email,
					email: email,
					password: password,
				}),
			});

			if (res.ok) {
				const data = await res.json();
				setCookies('token', data.token);
				setEmail('');
				setPassword('');
				setValidUser(true);
			} else {
				setError('Неверный логин или пароль');
			}
		}
	};

	const handelRegister = async () => {
		if (email.trim().length > 0 && password.trim().length > 0) {
			const res = await fetch(' http://127.0.0.1:8000/register/', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					username: email,
					email: email,
					password: password,
				}),
			});

			if (res.ok) {
				const data = await res.json();
				setCookies('token', data.token);
				setEmail('');
				setPassword('');
				setValidUser(true);
			} else {
				const data = await res.json().then((data) => data);
				if (data.password) {
					setError(data.password[0]);
				} else if (data.email) {
					setError(data.email[0]);
				} else {
					setError('Такой пользователь уже существует');
				}
			}
		}
	};

	return (
		<div
			style={{
				margin: '5rem auto',
				border: '1px solid #000',
				maxWidth: 400,
				padding: '1rem',
				borderRadius: 5,
			}}>
			{validUser ? (
				<div style={{
					display: 'flex',
					flexDirection: 'column'
				}}>
					<h1>Вы авторизованы</h1>
					<Link to='/ads'>Смотреть объявления</Link>
					<Link to='/logout'>Выйти</Link>
				</div>
			) : (
				<>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '1rem',

							gap: '1rem',
						}}>
						<h1>{isLogin ? 'Войти' : 'Зарегистрироваться'}</h1>
						<input
							style={{ width: '99%' }}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="E-mail"
						/>
						<input
							style={{ width: '99%' }}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
						/>
						{error && <p style={{ color: 'red' }}>{error}</p>}
						{isLogin ? (
							<button
								style={{ width: '101%' }}
								onClick={handelLogin}>
								Войти
							</button>
						) : (
							<button
								style={{ width: '101%' }}
								onClick={handelRegister}>
								Зарегистрироваться
							</button>
						)}
					</div>
					<button
						onClick={() => setIsLogin(!isLogin)}
						style={{}}>
						{isLogin ? 'Зарегистрироваться' : 'Войти'}{' '}
					</button>
				</>
			)}
		</div>
	);
};
