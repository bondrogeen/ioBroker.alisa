import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import I18n from '@iobroker/adapter-react/i18n';

export function Settings({ native, onChange, onSend }) {
	const [error, setError] = React.useState('');
	const [value, setValue] = React.useState(true);
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');

	const attr = 'token';

	const isDisabled = Boolean(!username || !password);

	const onSubmit = async () => {
		setError('');
		const res = await onSend('token', { username, password });
		const error_description = res?.error_description || '';
		const access_token = res?.access_token || '';
		if (error_description) setError(error_description);
		if (access_token) {
			onChange(attr, access_token);
			setValue(true);
			setUsername('');
			setPassword('');
		}
	};

	return (
		<div className="settings-form">
			{value && (
				<div>
					<h2>Token</h2>
					<TextField
						className="settings-form__textfield"
						fullWidth
						label={I18n.t(attr)}
						value={native[attr]}
						type="text"
						onChange={(e) => onChange(attr, e.target.value)}
						margin="normal"
					/>
					<span className="settings-form__link" onClick={() => setValue(false)}>
						get yandex token
					</span>
				</div>
			)}
			{!value && (
				<div>
					<h2>{I18n.t('login')}</h2>
					<TextField
						className="settings-form__textfield"
						fullWidth
						label={I18n.t('login')}
						value={username}
						type="text"
						onChange={(e) => setUsername(e.target.value)}
						margin="normal"
					/>
					<TextField
						className="settings-form__textfield"
						fullWidth
						label={I18n.t('password')}
						value={password}
						type="text"
						onChange={(e) => setPassword(e.target.value)}
						margin="normal"
					/>
					{error && <p className="settings-form__error">{error}</p>}
					<div className="settings-form__footer">
						<Button className="settings-form__btn" onClick={() => setValue(true)} size="medium">
							{I18n.t('cancel')}
						</Button>
						<Button
							className="settings-form__btn"
							variant="contained"
							onClick={onSubmit}
							size="medium"
							disabled={isDisabled}
						>
							{I18n.t('login')}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
