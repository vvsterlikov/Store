import React from 'react';
import client from './client.js'
import './styles.css';

const path = '/api/productCategories';
const defaultPageSize = '4';

export default class ProductCategoriesAdministration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			response : {},
			mode : 'EDIT',
			newRecord : {
				name : '',
				parent : '',
			},
		};
		this.gotoLastPage = this.gotoLastPage.bind(this);
		this.gotoFirstPage = this.gotoFirstPage.bind(this);
		this.gotoPrevPage = this.gotoPrevPage.bind(this);
		this.gotoNextPage = this.gotoNextPage.bind(this);
		this.saveNewRecord = this.saveNewRecord.bind(this);
		this.createNewRecord = this.createNewRecord.bind(this);
		this.cancelNewRecord = this.cancelNewRecord.bind(this);
		this.newRecordNameChange = this.newRecordNameChange.bind(this);
	}
	componentDidMount() {
		this.getData();
	}
	getData(page='0', pageSize=defaultPageSize, newMode='EDIT') {
		let pageParam = '?page='+page;
		let sizeParam = '&size='+pageSize;
		client({method : 'GET', path : path+pageParam+sizeParam}).then(response => {
			this.setState({
				response : response,
				mode : newMode,
			})
		})

	}
	gotoNextPage() {
		this.getData(parseInt(this.state.response.entity.currentPage)+1);
	}
	gotoLastPage() {
		this.getData(parseInt(this.state.response.entity.totalPages)-1);
	}
	gotoPrevPage() {
		this.getData(parseInt(this.state.response.entity.currentPage)-1);
	}
	gotoFirstPage() {
		this.getData();
	}
	saveNewRecord() {
		client({
			method : 'POST',
			path : path,
			entity : this.state.newRecord,
			headers : {'Content-Type' : 'application/json'},
		}).then(response => this.getData());
		
	}
	createNewRecord() {
		this.toggleMode();
	}
	cancelNewRecord() {
		this.toggleMode();
	}
	toggleMode() {
		this.setState({
			mode : this.state.mode == 'EDIT' ? 'NEW' : 'EDIT',
		});
	}
	newRecordNameChange(e) {
		const newRecord = {...this.state.newRecord};
		newRecord.name = e.target.value;
		this.setState({
			newRecord : newRecord,
		});
	}


	render() {
		const records = this.state.response.entity?.productCategories;

		if (!records) {
			return <div>Отсутствуют записи или ошибка загрузки</div>
		}

		
		const header = <tr>
			<td>Название категории</td>
			<td>Родительская категория</td>
		</tr>
		const editRecordsTable = <table className="content-table">
			{header}
			{records.map(row => 
			<tr>
				<td><input type='text' value={row.name} /></td>
				<td><select size='1'><option>{row.parent}</option></select></td>
			</tr>)}
		</table>

		const newRecordTable = <table className="content-table">
			{header}
			<tr>
				<td><input type='text' value={this.state.newRecord.name} onChange={this.newRecordNameChange}/></td>
				<td><select size='1'><option>{this.state.newRecord.parent}</option></select></td>
			</tr>
		</table>

		const prevPageStr = '<';
		const firstPageStr = '<<';

		const curPage = this.state.response.entity.currentPage;
		const totalPages = this.state.response.entity.totalPages;

		const topControls = this.state.mode == 'EDIT' ? <div>
			<button type='button' onClick={this.createNewRecord}>Создать</button>
			<button type='button' disabled={curPage==0} onClick={this.gotoPrevPage}>{prevPageStr}</button>
			<button type='button' disabled={curPage==0} onClick={this.gotoFirstPage}>{firstPageStr}</button>
			Страница {parseInt(curPage)+1} из {parseInt(totalPages)+1}
			<button type='button' disabled={curPage == parseInt(totalPages-1)} onClick={this.gotoNextPage}>></button>
			<button type='button' disabled={curPage == parseInt(totalPages-1)} onClick={this.gotoLastPage}>>></button>
		</div> :
		<div>
			<button type='button' onClick={this.saveNewRecord}>Сохранить</button>
			<button type='button' onClick={this.cancelNewRecord}>Отменить</button>
		</div>


		return <div>
			{topControls}
			{this.state.mode == 'EDIT' ? editRecordsTable : newRecordTable}
		</div>
	}


	
}