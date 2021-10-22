const React = require('react');
const ReactDOM = require('react-dom');

const rest = require('rest');
const mime = require('rest/interceptor/mime');
/*
const defaultRequest = require('rest/interceptor/defaultRequest');
const mime = require('rest/interceptor/mime');
const uriTemplateInterceptor = require('./api/uriTemplateInterceptor');
const errorCode = require('rest/interceptor/errorCode');
const baseRegistry = require('rest/mime/registry');

const registry = baseRegistry.child();
*/
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

	render() {
		const testTable = [
			[{name : "name11", value : "value11"},{name : "name12", value : "value12"}],
			[{name : "name21", value : "value21"},{name : "name22", value : "value22"}]
		];
		return (
			<div>
				<ProductCategoriesTable productCategories={this.state.productCategories} />
				<ListApplet rows={testTable} />
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
	}
	drawTopButtons() {
		if (this.state.mode == 'READ') {
			return <button type='button'>+</button>;
		}
		return "";
	}
	drawTableBody() {
		<table>{this.drawRows(this.state.rows)}</table>
	}
	drawRows(rows) {
		const rowsHtml = rows.map(row => <tr key={rows.indexOf(row)}>{row.val}</tr>);
		return(this.drawCols(rowsHtml)); 
	}
	drawCols(row) {
		const cols = row.cols.map(col => <td key={col.name}><Control type='editText' /></td>);
		return({cols});
	}
	render() {
		return(
			<div>
				<div>
					{this.drawTopButtons()}
				</div>
				<div>
					<table>
						<tr>
							<td>строка 1 колонка 1</td>
							<td><Control type='readOnlyText' text='text_to_read'/></td>
						</tr>
						<tr>
							<td><Control type='editText' text='text_to_write'/></td>
							<td>строка 2 колонка 2</td>
						</tr>
						{this.drawTableBody()}
					</table>
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
		console.log("control render");
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
		console.log("this.state.text="+this.state.text);
		return(control);
	}
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)