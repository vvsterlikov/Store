const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {productCategory: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/productCategory'}).done(response => {
			this.setState({productCategory: response.entity._embedded.employees});
		});
	}

	render() {
		return (
			<ProductCategory productCategory={this.state.productCategory}/>
		)
	}
}

class EmployeeList extends React.Component{
	render() {
		const productCategory = this.props.productCategory.map(prodcat =>
			<ProductCategory key={prodcat._links.self.href} productCategory={productCategory}/>
		);
		return (
			<table>
				<tbody>
					<tr>
						<th>Name</th>
					</tr>
					{productCategory}
				</tbody>
			</table>
		)
	}
}