import React from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

export function Service({ onSend }) {
	const [loading, setLoading] = React.useState(false);
	const [list, setList] = React.useState([]);

	const onScan = async () => {
		setLoading(true);
		const res = await onSend('scan', {});
		if (res?.length) {
			setList(res);
		}
		console.log(res);
		setLoading(false);
	};

	return (
		<div>
			<Button variant="contained" color="primary" onClick={onScan} size="medium" disabled={loading}>
				Scan
			</Button>
			{list &&
				list.map(({ id, ip, platform, port }) => {
					return (
						<List key={id}>
							<ListItem alignItems="flex-start">
								<ListItemText
									primary={`${ip}:${port}`}
									secondary={
										<Typography component="span" variant="body2" color="textPrimary">
											{platform}
										</Typography>
									}
								/>
							</ListItem>
						</List>
					);
				})}
		</div>
	);
}
