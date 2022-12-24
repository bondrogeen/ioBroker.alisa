import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export function HeaderTabs({ className, value, onChange, list = [] }) {
	return (
		<Tabs className={className} value={value} onChange={onChange} aria-label="scrollable auto tabs example">
			{list.map((item, i) => {
				return <Tab label={item} key={i} />;
			})}
		</Tabs>
	);
}
