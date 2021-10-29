const React = require('react');
const ReactDOM = require('react-dom');

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const follow = require('./follow.js');
const client = require('./client.js');

let renderCount = 0;


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			productCategories: [],
			productCategoriesNameValue: [],
		};
	}

	componentDidMount() {
		//тянем данные из бэка и сохраняем в стейт

		console.log("misc demo study BEGIN");

		follow("Demo1");


		console.log("misc demo study END");

		//const client = rest.wrap(mime);
        client({method: 'GET', path: '/api/productCategories'}).then(response => {
        	this.setState({
        		productCategories : response.entity._embedded.productCategories,
        		productCategoriesNameValue : this.toNameValueArray(response.entity._embedded.productCategories,["name"]),
        	});
        });
	}
	toNameValueArray(arr, propsFilter) {
		let result = [];
		for (let row of arr) {
			let tmp = [];
			for (let col in row) {
				if (propsFilter.includes(col))
					tmp.push({name : col, value : row[col]})
			}
			result.push(tmp);
		}
		return result;
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
				
				<ListApplet rows={this.state.productCategoriesNameValue} add={() => this.addNewRecord()} cancel={() => this.cancelNewRecord()} save={() => this.saveRecords()}/>
			</div>
		)
	}
}

class ProductCategoriesTable extends React.Component{
	render() {
		const productCategories = this.props.productCategories
		    .map(elem => <ProductCategory key={elem._links.self.href} productCategory={elem}/>);
		return (
			<table>
				<tr>
					<th>Категория товара</th>
				</tr>

					{productCategories}
			</table>
		)
	}
}

class ProductCategory extends React.Component {
    render() {
        return(
            <tr>
                <td>{this.props.productCategory.name}</td>
            </tr>
        )
    }
}

class ListApplet extends React.Component {
	constructor(props) {
		super(props);
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
				<tr>{this.props.rows[0].map((header,headerIndex) => <td key={headerIndex}>{header.name}</td>)}</tr>
				{this.props.rows.map((row, rowIndex) => <tr key={rowIndex}>{
					row.map((col,colIndex)=><td key={colIndex}><Control type="editText" text={col.value}/></td>)
				}</tr>)}
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
			control = <input type="text" size="10" value={this.state.text} onChange={event => this.setState({text : event.target.value})}></input>	
		}
		return(control);
	}
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)