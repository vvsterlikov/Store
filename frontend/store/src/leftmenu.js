import React from 'react';
import './styles.css';


export default class LeftMenu extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return	<ul>{this.props.menuItems.map((item, index) => <li className="leftmenu-item"><button type='button' onClick={() => this.props.clickHandler(index)}>{item}</button></li>)}</ul>;
	}
}

/*
export default () => {
	return <div>hello world!</div>;
}
*/


