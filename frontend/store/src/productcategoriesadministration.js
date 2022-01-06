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
		};
		this.gotoLastPage = this.gotoLastPage.bind(this);
		this.gotoFirstPage = this.gotoFirstPage.bind(this);
		this.gotoPrevPage = this.gotoPrevPage.bind(this);
		this.gotoNextPage = this.gotoNextPage.bind(this);
	}
	componentDidMount() {
		this.getData();
	}
	getData(page='0', pageSize=defaultPageSize) {
		let pageParam = '?page='+page;
		let sizeParam = '&size='+pageSize;
		client({method : 'GET', path : path+pageParam+sizeParam}).then(response => {
			this.setState({
				response : response,
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

	render() {
		const records = this.state.response.entity?.productCategories;

		if (!records) {
			return <div>Отсутствуют записи или ошибка загрузки</div>
		}

		const contentTable = <table className="content-table">
			<tr>
				<td>Название категории</td>
				<td>Родительская категория</td>
			</tr>
			{records.map(row => 
			<tr>
				<td><input type='text' value={row.name} /></td>
				<td><select size='1'><option>{row.parent}</option></select></td>
			</tr>)}
		</table>

		const prevPageStr = '<';
		const firstPageStr = '<<';

		const curPage = this.state.response.entity.currentPage;
		const totalPages = this.state.response.entity.totalPages;

		const topControls = <div>
			<button type='button'>Создать</button>
			<button type='button' disabled={curPage==0} onClick={this.gotoPrevPage}>{prevPageStr}</button>
			<button type='button' disabled={curPage==0} onClick={this.gotoFirstPage}>{firstPageStr}</button>
			Страница {parseInt(curPage)+1} из {parseInt(totalPages)+1}
			<button type='button' disabled={curPage == parseInt(totalPages-1)} onClick={this.gotoNextPage}>></button>
			<button type='button' disabled={curPage == parseInt(totalPages-1)} onClick={this.gotoLastPage}>>></button>
		</div>


		return <div>
			{topControls}
			{contentTable}
		</div>
	}


	
}