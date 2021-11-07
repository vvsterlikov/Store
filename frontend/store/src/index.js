const React = require('react');
const ReactDOM = require('react-dom');

const rest = require('rest');
const mime = require('rest/interceptor/mime');
const follow = require('./follow.js');
const client = require('./client.js');

let renderCount = 0;
const root = '/api';
const ENTITY_NAME = 'productCategories';
const DEFAULT_PAGESIZE = 3;


class App extends React.Component {

	constructor(props) {
		super(props);
		this.params = {};
		this.state = {
			productCategories: [],
			productCategoriesNameValue: [],
			response : {},
			pageSize : 0,
			links : [],
			page : [],
			attributes : [],
			totalPages : 0,
		};
		this.sendToBackend = this.sendToBackend.bind(this);
		this.gotoNextPage = this.gotoNextPage.bind(this);
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
		this.getParams(ENTITY_NAME).then(params => 
			this.params = params
		).then(() => this.getProfile(this.params.profileLink)).then((response) => {
			this.params.attributes = Object.keys(response.entity.properties);
		}).then(() => this.gotoFirstPage(this.params.entityLink));
	}

	getParams(entityName) {
		return client({method : 'GET', path: '/api/'+entityName}).then((result) => {
			return {
				entityLink : result.entity._links.self.href,
				profileLink : result.entity._links.profile.href,
				pageSize : result.entity.page.size,
			}
		});
	}

	getProfile(profileLink) {
		return client({method : 'GET', path : profileLink, headers : {'Accept' : 'application/schema+json'}}).then(response => response);
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
	sendToBackend(newRecord) {
		console.log("send invoked "+newRecord.name);
		return follow(client,root,['productCategories']).then(response => {
			return client({
				method : 'POST',
				path : response.entity._links.self.href,
				entity : newRecord,
				headers : {'Content-Type' : 'application/json'},
			});
		}).then((r) => this.gotoLastPage());
	}

	gotoNextPage() {
		console.log("next");
		client({method : 'GET', path : this.state.links.next.href}).then(response => this.setState({
			productCategories : response.entity._embedded.productCategories,
			page : response.entity.page,
			links : response.entity._links,
		}));
	}

	gotoPrevPage() {
		client({method : 'GET', path : this.state.links.prev.href}).then(response => this.setState({
			productCategories : response.entity._embedded.productCategories,
			page : response.entity.page,
			links : response.entity._links,
		}));

	}

	gotoFirstPage(link){
		client({method : 'GET', path : link}).then(response =>
			this.setState({
				productCategories : response.entity._embedded.productCategories,
				page : response.entity.page,
				links : response.entity._links,
			})
		);
	}

	gotoLastPage(link) {
		client({method : 'GET', path : link, params : {page : 0}})
			.then(response => response.entity.page.totalPages)
			.then(totalPages => client({method : 'GET', path : link+'?page='+parseInt(totalPages-1), params : {page : 0}}))
			.then(response => {
				this.setState({
				productCategories : response.entity._embedded.productCategories,
				page : response.entity.page,
				links : response.entity._links,
			})
		});
	}

	render() {
		return (
			<div>
				<ListApplet attributes={this.params.attributes} rows={this.state.productCategories} add={() => this.addNewRecord()} cancel={() => this.cancelNewRecord()} 
					save={this.sendToBackend}
					navNext={this.gotoNextPage}/>
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
		const navButtons = <div>
			<button type='button' onClick={() => this.props.navFirst}>&lt;&lt;</button>
			<button type='button' onClick={() => this.props.navPrev}>&lt;</button>
			<button type='button' onClick={() => this.props.navNext}>></button>
			<button type='button' onClick={() => this.props.navLast}>>></button>
		</div>
		if (this.state.mode == 'RW') {
			return( 
				<div>
					<button type='button' onClick={() => this.toggleTopButtons()}>Добавить</button>
					<button type='button' onClick={() => this.save()}>Сохранить</button>
					{navButtons}
				</div>
				)
		}
		else if (this.state.mode == 'ADD') {
			return (
				<div>
					<button type='button' onClick={() => this.toggleTopButtons()}>Отменить</button>
					<button type='button' onClick={() => this.save(this.props.save)}>Сохранить</button>
					{navButtons}
				</div>
				)
		}
		return null;
	}
	save(saveHandler) {
		let newRecord = {};
		for (attr of this.props.attributes) {
			//console.log(`this.inpRefs[${attr}].value=${this.inpRefs[attr].value}`);
			newRecord[attr] = this.inpRefs[attr].value;
		}
		saveHandler(newRecord).then(() => this.setState({mode : 'RW'}));
	}
	toggleTopButtons() {
		console.log("toggleHeader");
		if (this.state.mode == 'RW') {
			this.setState({mode : 'ADD'})
			//this.props.add();
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
					this.props.attributes.map((col) => <td key={col+rowIndex}><Control type="editText" value={row[col]}/></td>)
				}</tr>)}
				{this.state.mode == 'ADD' && this.props.attributes.map((col,index) =>
					<td key={index}><Control type='editText' controlRef={el => this.inpRefs[col] = el} value={col}/></td>
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
			value : this.props.value,
		};
	}
	render() {
		let control;
		if (this.props.type == 'button') {
			control = <button type='button'>{this.props.name}</button>
		}
		else if (this.props.type == 'readOnlyText') {
			control = <div>{this.props.value}</div>	
		}
		else if (this.props.type == 'editText') {
			control = <input type="text" ref={this.props.controlRef} size="10" value={this.state.value}
				onChange={(e)=>this.setState({value : e.target.value})}>
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