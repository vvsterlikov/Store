const React = require('react');
const ReactDOM = require('react-dom');
const client = require('rest');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {productCategories: []};
	}

	componentDidMount() {
        /*
        client({method: 'GET', path: '/api/productCategories'})
		    .done(response => {this.setState({productCategories: response.entity._embedded.productCategories})
                                }
            );
            */

        client('/api/productCategories').then(response => {
        	this.setState({productCategories : response.entity._embedded ? response.entity._embedded.productCategories : ""})
        });
                    /*
		client('/api/productCategories')
		    .then(response => { for (prop in response) {
		                            console.log(`response[${prop}]=${response[prop]}`);
		                        }
		    });
		    */

	}

	render() {
		return (
			/*<ProductCategoriesTable productCategories={this.state.productCategories}/>*/
			<div>test2</div>
		)
	}
}

class ProductCategoriesTable extends React.Component{
	render() {
		const productCategories= this.props.productCategories
		    .map(elem => <ProductCategory key={elem._links.self.href} productCategory={productCategory}/>);
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

ReactDOM.render(
    <App />,
    document.getElementById('react')
)