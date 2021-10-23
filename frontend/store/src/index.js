const React = require('react');
const ReactDOM = require('react-dom');

const rest = require('rest');
const mime = require('rest/interceptor/mime');

let renderCount = 0;
/*
const defaultRequest = require('rest/interceptor/defaultRequest');
const mime = require('rest/interceptor/mime');
const uriTemplateInterceptor = require('./api/uriTemplateInterceptor');
const errorCode = require('rest/interceptor/errorCode');
const baseRegistry = require('rest/mime/registry');

const registry = baseRegistry.child();
*/
function printObject(obj) {
	console.log("{");
	for (let prop in obj) {
		if (typeof obj[prop] == "object") {
			printObject(obj[prop]);
		}
		else {
			console.log(`obj[${prop}]=${obj[prop]}`);
		}
	}
	console.log("}");
}

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			productCategories: [],
		};
	}

	componentDidMount() {
		/*
		registry.register('text/uri-list', require('./api/uriListConverter'));
		registry.register('application/hal+json', require('rest/mime/type/application/hal'));

		const client = rest
			.wrap(mime, { registry: registry })
			.wrap(uriTemplateInterceptor)
			.wrap(errorCode)
			.wrap(defaultRequest, { headers: { 'Accept': 'application/hal+json' }});
        client({method: 'GET', path: '/api/productCategories'})
		    .done(response => {
		    	this.setState({productCategories: response.entity._embedded.productCategories})
			});

		*/
		const client = rest.wrap(mime);
        client({path: '/api/productCategories'}).then(response => {
        	this.setState({productCategories : response.entity._embedded.productCategories});
        });
        /*
    	client('/api/productCategories')
		    .then(response => { for (prop in this.state.productCategories) {
		                            console.log(`response[${prop}]=${response[prop]}`);
		                        }
		    });
		  */  

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

	render() {
		console.log(`renderCount: ${renderCount++}`);
		const testTable = [
			[{name : "name11", value : "value11"},{name : "name12", value : "value12"}],
			[{name : "name21", value : "value21"},{name : "name22", value : "value22"}]
		];
		//for (let elem in this.state.productCategories[0]) {
		//	console.log(`productCategories[0][${elem}]=${this.state.productCategories[0][elem]}`);
		//}
		//if (this.state.productCategories.length > 0) {
		//	console.log(`productCategories[0].name=${this.state.productCategories[0].name}`);
		//}
		/*
		console.log("test begin");
		if (this.state.productCategories.length > 0) {
			printObject(this.toNameValueArray(this.state.productCategories,["name"]));
			//for (let e in this.toNameValueArray(this.state.productCategories,["name"])) {
		}
		console.log("test end");
		*/
//		return(<div>test</div>);
		if (this.state.productCategories.length > 0) {
			let name1 = this.toNameValueArray(this.state.productCategories,["name"])[0];
			console.log("name1="+printObject(name1));
		}
		return (
			<div>
				<ProductCategoriesTable productCategories={this.state.productCategories} />
				<ListApplet rows={this.toNameValueArray(this.state.productCategories,["name"])} />
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
		this.state = {
			mode : 'READ',
			columns : props.columns,
			rows : props.rows,
		};
		//this.drawListApplet = this.drawListApplet.bind(this);
	}
	drawTopButtons() {
		if (this.state.mode == 'READ') {
			return <button type='button'>+</button>;
		}
		return null;
	}
	drawTableBody() {
		return (<table>{
			this.state.rows.map((row, rowIndex) => <tr key={rowIndex}>{
				row.map((col,colIndex)=><td key={colIndex}><Control type="editText" text={col.value}/></td>)
			}</tr>)
		}</table>);
	}
	render() {
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