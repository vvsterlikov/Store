const React = require('react');
const ReactDOM = require('react-dom');

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const follow = require('./follow.js');
const client = require('./client.js');

let renderCount = 0;
const root = '/api';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			productCategories: [],
			productCategoriesNameValue: [],
			response : {},
			pageSize : 0,
			links : [],
			attributes : [],
		};
	}
	loadFromServer(pageSize) {
		follow(client, root, [{rel: 'productCategories', params: {size: pageSize}}]
		).then(productCategoryCollection => {
			console.log("22="+productCategoryCollection.entity._links.profile.href);
			return client({
				method: 'GET',
				path: productCategoryCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				console.log("33");
				this.schema = schema.entity;
				return productCategoryCollection;
			});
		}).then(productCategoryCollection => {
			console.log("44");
			this.setState({
				productCategories: productCategoryCollection.entity._embedded.productCategories,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: productCategoryCollection.entity._links});
		});
	}

	componentDidMount() {
		//тянем данные из бэка и сохраняем в стейт

		console.log("misc demo study BEGIN");

		//follow("Demo1");
		/*
		let p = new Promise((resolve,reject) => {
			setTimeout(() => resolve({status : "resolved"}),7000);
		});

		p.then(res => 
			{
				console.log(res.status);
				return new Promise((res,rej)=> {setTimeout(() => {res("resolved1")},3000)});
		}).then(res => console.log(res));


		let fun1 = () => "1";
		let fun2 = () => {"1"};

		console.log("fun1="+fun1());
		console.log("fun2="+fun2());
		*/
		this.loadFromServer(10);

		console.log("misc demo study END");

		//const client = rest.wrap(mime);
        client({method: 'GET', path: '/api'}).then(response => {let r = response;});


        /*
        client({method: 'GET', path: '/api/productCategories'}).then(response => {
        	this.setState({
        		productCategories : response.entity._embedded.productCategories,
        		productCategoriesNameValue : this.toNameValueArray(response.entity._embedded.productCategories,["name"]),
        	});
        });
        */
	}

	addNewRecord() {
		console.log("add record pressed");
		let newProductCategoriesNameValue = this.state.productCategoriesNameValue.slice();
		let row = [];
		for (let elem in newProductCategoriesNameValue[0]) {
			row.push({name : elem.name, value : ""})
		}
		newProductCategoriesNameValue.push(row);
		this.setState({productCategoriesNameValue : newProductCategoriesNameValue});

	}
	cancelNewRecord() {
		console.log("cancel record pressed");
		let newProductCategoriesNameValue = this.state.productCategoriesNameValue.slice();
		newProductCategoriesNameValue.pop();
		this.setState({productCategoriesNameValue : newProductCategoriesNameValue});
	}
	saveRecords() {
		console.log("save invoked");
	}

	render() {
		return (
			<div>
				<ListApplet attributes={this.state.attributes} rows={this.state.productCategories} add={() => this.addNewRecord()} cancel={() => this.cancelNewRecord()} save={() => this.saveRecords()}/>
			</div>
		)
	}
}


class ListApplet extends React.Component {
	constructor(props) {
		super(props);
		this.inpRefs = {};
		console.log("child constructor");
		this.state = {
			mode : 'RW',
			columns : props.columns,
			rows : props.rows,
		};
	}
	componentDidMount() {
		console.log("child component did mount");
	}
	drawTopButtons() {
		if (this.state.mode == 'RW') {
			return( 
				<div>
					<button type='button' onClick={() => this.toggleTopButtons()}>Добавить</button>
					<button type='button' onClick={() => this.props.save()}>Сохранить</button>
				</div>)
		}
		else if (this.state.mode == 'ADD') {
			return (
				<div>
					<button type='button' onClick={() => this.toggleTopButtons()}>Отменить</button>
					<button type='button' onClick={() => this.props.save()}>Сохранить</button>
				</div>
				)
		}
		return null;
	}
	toggleTopButtons() {
		console.log("toggleHeader");
		if (this.state.mode == 'RW') {
			this.setState({mode : 'ADD'})
			this.props.add();
		}
		else {
			this.setState({mode : 'RW'})	
			this.props.cancel();
		}
	}
	drawTableBody() {
		if (this.props.rows.length > 0) {
			return (<table>
				<tr>{this.props.attributes.map((elem,index) => <td key={index}>{elem}</td>)}</tr>
				{this.state.mode == 'RW' && this.props.rows.map((row, rowIndex) => <tr key={rowIndex}>{
					this.props.attributes.map((col) => <td key={col+rowIndex}><Control type="editText" text={row[col]}/></td>)
				}</tr>)}
				{this.state.mode == 'ADD' && this.props.attributes.map((col,index) =>
					<td key={index}><Control type='editText' controlRef={el => this.inpRefs[col] = el} text={col}/></td>
				)}
			</table>);
		}
		else {
			return(<div>Нет записей</div>)
		}
	}
	render() {
		console.log("render child="+this.state.mode);
		return(
			<div>
				<div>
					{this.drawTopButtons()}
				</div>
				<div>
					{this.drawTableBody()}
				</div>
			</div>
		)
	}
}

class Control extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text : props.text,
		}
	}
	render() {
		let control;
		if (this.props.type == 'button') {
			control = <button type='button'>{this.props.name}</button>
		}
		else if (this.props.type == 'readOnlyText') {
			control = <div>{this.props.text}</div>	
		}
		else if (this.props.type == 'editText') {
			control = <input type="text" 
				ref={this.props.controlRef}
				size="10" 
				value={this.state.text} 
				onChange={event => this.setState({text : event.target.value})}>
			</input>	
		}
		return(control);
	}
}

class CreateDialog extends React.Component {
	constructor(props) {
		super(props)
	}
	handleSubmit(e) {
		e.preventDefault();
		const newProductCategory = {};
		this.props.attributes.forEach(attribute => {newProductCategory[attribute] = ReactDOM.fin});
	}
	render() {
		return(null);
	}
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)