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
		return (
			<div>
				<ProductCategoriesTable productCategories={this.state.productCategories} />
				<ListApplet />
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
			columns : [],
		};
	}
	drawTopButtons() {
		if (this.state.mode == 'READ') {
			return <button type='button'>+</button>;
		}
		return "";
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
					</table>
				</div>
			</div>
		)
	}
}

class Control extends React.Component {
	constructor(props) {
		super(props);
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
			control = <input type="text" size="10" value={this.props.text}></input>	
		}
		return(control);
	}
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)