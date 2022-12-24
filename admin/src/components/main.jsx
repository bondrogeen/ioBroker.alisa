import React from 'react';
import { Settings } from './settings';
import { Service } from './service';
import { HeaderTabs } from './tabs';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && <div>{children}</div>}
		</div>
	);
}

export function Main({ onSend, onChange, native }) {
	const list = ['Settings', 'Service'];
	const [value, setValue] = React.useState(0);

	return (
		<div className="main">
			<HeaderTabs className="main__tabs" value={value} onChange={(e, val) => setValue(val)} list={list} />
			<TabPanel value={value} index={0}>
				<Settings native={native} onChange={onChange} onSend={onSend} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Service onSend={onSend}></Service>
			</TabPanel>
		</div>
	);
}
