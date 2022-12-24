import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import I18n from '@iobroker/adapter-react/i18n';
/**
 * @type {() => Record<string, import("@material-ui/core/styles/withStyles").CreateCSSProperties>}
 */
const styles = () => ({
	input: {
		marginTop: 0,
		minWidth: 400,
	},
	button: {
		marginRight: 20,
	},
	card: {
		maxWidth: 345,
		textAlign: 'center',
	},
	media: {
		height: 180,
	},
	column: {
		display: 'inline-block',
		verticalAlign: 'top',
		marginRight: 20,
	},
	columnLogo: {
		width: 350,
		marginRight: 0,
	},
	columnSettings: {
		width: 'calc(100% - 370px)',
	},
	controlElement: {
		//background: "#d2d2d2",
		marginBottom: 5,
	},
});

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	renderInput(title, attr, type) {
		return (
			<TextField
				label={I18n.t(title)}
				className={`${this.props.classes.input} ${this.props.classes.controlElement}`}
				value={this.props.native[attr]}
				type={type || 'text'}
				onChange={(e) => this.props.onChange(attr, e.target.value)}
				margin="normal"
			/>
		);
	}

	onSend(e) {
		console.log(e);
		console.log(this);
	}

	render() {
		return <form className={this.props.classes.tab}>{this.renderInput('token', 'token', 'text')}</form>;
	}
}

export default withStyles(styles)(Settings);
