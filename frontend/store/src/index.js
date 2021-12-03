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
	}

	render() {
		return (
			<div>
				<ListApplet entityName='productCategories' />
			</div>
		)
	}
}


class ListApplet extends React.Component {
	constructor(props) {
		super(props);
		this.inpRefs = {};
		this.params = {};
		this.state = {
			mode : 'RW',
			links : {},
			page : {},
			records: [],
			newRecord : {},
			pageSizeCustom : 0,
			needSendChanges : false,
		};
		//this.gotoNextPage = this.gotoNextPage.bind(this);
		this.saveNewRecord = this.saveNewRecord.bind(this);

	}
	componentDidMount() {
		/*
		this.getParams(this.props.entityName).then(params => 
			this.params = params
		).then(() => this.getProfile(this.params.profileLink)).then((response) => {
			this.params.attributes = Object.keys(response.entity.properties);
		}).then(() => this.gotoFirstPage(this.params.entityLink));
		*/
		this.getParams(this.props.entityName).then(params => 
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
			}
		});
	}

	getProfile(profileLink) {
		return client({method : 'GET', path : profileLink, headers : {'Accept' : 'application/schema+json'}}).then(response => response);
	}
	gotoNextPage() {
		/*
		client({method : 'GET', path : this.state.links.next.href}).then(response => this.setState({
			records : response.entity._embedded[this.props.entityName],
			page : response.entity.page,
			links : response.entity._links,
		}));
		*/
		client({method : 'GET', path : this.state.links.next.href}).then(response => {
			this.page = response.entity.page;
			this.links = response.entity._links;
			return Promise.all(response.entity._embedded[this.props.entityName].map(elem => 
				client({method : 'GET', path : elem._links.self.href})
			))
		}).then(detailedRecords => {
			this.setState({
				records : detailedRecords,
				page : this.page,
				pageSizeCustom : this.pageSizeCustom,
				links : this.links,
			})
		});
	}

	gotoPrevPage() {
		/*
		client({method : 'GET', path : this.state.links.prev.href}).then(response => this.setState({
			records : response.entity._embedded[this.props.entityName],
			page : response.entity.page,
			links : response.entity._links,
		}));
		*/
		client({method : 'GET', path : this.state.links.prev.href}).then(response => {
			this.page = response.entity.page;
			this.links = response.entity._links;
			return Promise.all(response.entity._embedded[this.props.entityName].map(elem => 
				client({method : 'GET', path : elem._links.self.href})
			))
		}).then(detailedRecords => {
			this.setState({
				records : detailedRecords,
				page : this.page,
				pageSizeCustom : this.pageSizeCustom,
				links : this.links,
			})
		});		

	}

	gotoFirstPage(link,size){
		let pageSize = '';
		if (size) {
			pageSize = '?size='+size;
		}
		/*
		client({method : 'GET', path : link+pageSize}).then(response =>
			this.setState({
				records : response.entity._embedded[this.props.entityName],
				page : response.entity.page,
				pageSizeCustom : response.entity.page.size,
				links : response.entity._links,
			})
		);
		*/
		client({method : 'GET', path : link+pageSize}).then(response => {
				this.page = response.entity.page;
				this.pageSizeCustom = response.entity.page.size;
				this.links = response.entity._links;
				return Promise.all(response.entity._embedded[this.props.entityName].map(record => 
					client({method : 'GET',	path : record._links.self.href,})
			))}
		).then(detailedRecords => {
			this.setState({
				records : detailedRecords,
				page : this.page,
				pageSizeCustom : this.pageSizeCustom,
				links : this.links,
			})

		});

	}

	gotoLastPage(link,newMode) {
		/*
		client({method : 'GET', path : link, params : {page : 0}})
			.then(response => response.entity.page.totalPages)
			.then(totalPages => client({method : 'GET', path : link+'?page='+parseInt(totalPages-1), params : {page : 0}}))
			.then(response => {
				this.setState({
					records : response.entity._embedded[this.props.entityName],
					page : response.entity.page,
					links : response.entity._links,
					mode : newMode ? newMode : this.state.mode,
			})
		});
		*/
		client({method : 'GET', path : link, params : {page : 0}})
			.then(response => response.entity.page.totalPages)
			.then(totalPages => client({method : 'GET', path : link+'?page='+parseInt(totalPages-1), params : {page : 0}}))
			.then(response => {
				this.page = response.entity.page;
				this.links = response.entity._links;  
				return Promise.all(response.entity._embedded[this.props.entityName].map(elem => 
					client({method : 'GET', path : elem._links.self.href})
				))

		}).then(detailRecords => {
			this.setState({
					records : detailRecords,
					page : this.page,
					links : this.links,
					mode : newMode ? newMode : this.state.mode,	
			})
		});

	}
	saveNewRecord() {
		console.log("send invoked ");
		client({
				method : 'POST',
				path : this.params.entityLink,
				entity : this.state.newRecord,
				headers : {'Content-Type' : 'application/json'},
		}).then(() => 
			this.gotoLastPage(this.params.entityLink,'RW')
		);
	}

	toggleTopButtons() {
		if (this.state.mode == 'RW') {
			const newRec = this.params.attributes.reduce((obj,elem) => {
				obj[elem]='';
				return obj;
			},{});
			this.setState({
				mode : 'ADD',
				newRecord : newRec,
			})

		}
		else {
			this.setState({
				mode : 'RW',
			})	
		}
	}
	modifyRecord(e,attr,index) {
		console.log("child change");
		console.log("attr="+attr);
		console.log("index="+index);
		console.log("value="+e.target.value);
		const newVal = e.target.value.trim();
		const oldVal = this.state.records[index].entity[attr];
		console.log("old val="+oldVal);
		console.log("new val="+newVal);
		let newRecords = [...this.state.records];
		newRecords[index].entity[attr] = newVal;
		this.setState({
			records : newRecords,
			prevRecords ; this.state.records,
		});
		//let evt = e; 
	}
	saveModifiedRecord(e,attr,index) {
		console.log("blur");
		console.log("attr="+attr);
		console.log("index="+index);
		console.log("value="+e.target.value);
		let evt = e;
		this.state	
	}
	newRecordChange(e,attr) {
		let rec = {...this.state.newRecord};
		rec[attr] = e.target.value;
		this.setState({newRecord : rec});
	}
	deleteRecord(index) {
		//console.log("delete index="+this.state.records[index].url);
		client({
			method : 'DELETE',
			path : this.state.records[index].url,
		}).then(() => this.gotoFirstPage(this.params.entityLink,this.state.page.size));
	}
	drawTopButtons() {
		const navButtons = <div>
			<button disabled={!this.state.links.prev} type='button' onClick={() => this.gotoFirstPage(this.params.entityLink,this.state.page.size)}>&lt;&lt;</button>
			<button disabled={!this.state.links.prev} type='button' onClick={() => this.gotoPrevPage()}>&lt;</button>
			<button disabled={!this.state.links.next} type='button' onClick={() => this.gotoNextPage()}>></button>
			<button disabled={!this.state.links.next} type='button' onClick={() => this.gotoLastPage(this.params.entityLink)}>>></button>
		</div>
		if (this.state.mode == 'RW') {
			return( 
				<div>
					<button type='button' onClick={() => this.toggleTopButtons()}>Добавить</button>
					{navButtons}
				</div>
				)
		}
		else if (this.state.mode == 'ADD') {
			return (
				<div>
					<button type='button' onClick={() => this.toggleTopButtons()}>Отменить</button>
					<button type='button' onClick={this.saveNewRecord}>Сохранить</button>
					{navButtons}
				</div>
				)
		}
		return null;
	}

	drawTableBody() {
		if (this.state.records.length > 0) {
			return (<table>
				<tr>{this.params.attributes.map((elem,index) => <td key={index}>{elem}</td>)}</tr>
				{this.state.mode == 'RW' && this.state.records.map((row, rowIndex) => <tr key={rowIndex}>{
					this.params.attributes.map((col) => <td key={col+rowIndex}><Control type="editText" value={row.entity[col]}
						onChange={(e) => this.modifyRecord(e,col,rowIndex)}
						onBlur={e => this.saveModifiedRecord(e, col, rowIndex)}/></td>)
				}<td><Control type='button' name='X' onClick={() => this.deleteRecord(rowIndex)}/></td>
				</tr>)}
				{this.state.mode == 'ADD' && this.params.attributes.map((col,index) =>
					<td key={index}><Control type='editText' controlRef={el => this.inpRefs[col] = el} value={this.state.newRecord[col]}
					onChange={(e) => this.newRecordChange(e,col)}/></td>
				)}
			</table>);
		}
		else {
			return(<div>Нет записей</div>)
		}
	}
	drawPageSize() {
		return(
			<div>
				Записей на странице: <Control type='editText' value={this.state.pageSizeCustom} onChange={e => this.changePageSize(e)}/>
				<button type='button' onClick={e=>this.savePageSize()}>Применить</button>
			</div>
		)
	}
	changePageSize(e) {
		this.setState({
			pageSizeCustom : e.target.value,
		});
		
	}
	savePageSize() {
		const size = this.state.pageSizeCustom;
		if (/^[^1-9]|[^0-9]/.test(size)) {
			alert("Некорректный размер страницы");
			return;
		}
		this.gotoFirstPage(this.params.entityLink,size);
	}
	render() {
		console.log("render child="+this.state.mode);
		return(
			<div>
				<div>
					{this.drawTopButtons()}
				</div>
					{this.drawPageSize()}
				<div>
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
		this.params = {};
		this.state = {
			value : this.props.value,
		};
	}


	render() {
		let control;
		if (this.props.type == 'button') {
			control = <button type='button' onClick={this.props.onClick}>{this.props.name}</button>
		}
		else if (this.props.type == 'readOnlyText') {
			control = <div>{this.props.value}</div>	
		}
		else if (this.props.type == 'editText') {
			control = <input type="text" ref={this.props.controlRef} size="10" value={this.props.value}
				onChange={this.props.onChange}
				onBlur={this.props.onBlur}>
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