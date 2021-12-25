import React from 'react';

const menuItems = ['Категории', 'Связь категорий'];

export default class LeftMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItem : 0,
		};
	}
	render() {
		return	<ul>{menuItems.map(item => <li><button type='button'>{item}</button></li>)}</ul>;
	}
}

/*
export default () => {
	return <div>hello world!</div>;
}
*/


