import React from 'react';


export default class LeftMenu extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return	<ul>{this.props.menuItems.map((item, index) => <li><button type='button' onClick={() => this.props.clickHandler(index)}>{item}</button></li>)}</ul>;
	}
}

/*
export default () => {
	return <div>hello world!</div>;
}
*/


