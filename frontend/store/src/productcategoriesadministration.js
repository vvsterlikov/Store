import React, {useState, useEffect} from 'react';
import client from './client.js'
import './styles.css';
import CustomButton from './components/ui/button/custombutton.js';
import Modal from './components/ui/modal/modal.js';
import EditForm from './components/ui/editform.js';
import List from './components/ui/list.js';
import PageControl from './components/ui/pagecontrol.js';

const pathBase = "http://localhost:8080"
const path = pathBase + '/api/productCategories';
const getAllRecordsPath = '/api/productCategories/getAllRecords';
const getAvailableParentsPath = pathBase + '/api/productCategories/getAvailableParents';
const defaultPageSize = '4';



const ProductCategoriesAdministration = () => {

	const emptyRecord = {
		id : '',
		name : '',
		parent : [],
		selectedParName : '', 
		selectedParId : '',
	}

	const [popupParams, setPopupParams] = useState({isEditVisible : false, record : {...emptyRecord}});
	const [page, setPage] = useState(0);
	const [response, setResponse] = useState({});

	async function fetchData(p) {
		const response = await client({method : 'GET', path : path+'?page='+p});
		setResponse(response);
	}

	useEffect(() => {
		fetchData(page);
	},[page]);

	async function openPopupEdit(id='') {
		const availParents = await client({method : 'GET', path : getAvailableParentsPath});
		const record = {
			id : id,
			name : response.entity.productCategories.filter(elem => elem.id==id)[0].name,
			parent : [...availParents.entity],
			selectedParName : response.entity.productCategories.filter(elem => elem.id==id)[0].parent?.name, 
			selectedParId : response.entity.productCategories.filter(elem => elem.id==id)[0].parent?.id,
		}
		setPopupParams({isEditVisible : true, record : record});

	}

	async function openPopupNew() {
		const response = await client({method : 'GET', path : getAvailableParentsPath});
		const record = {...popupParams.record, parent : [...response.entity]};
		console.log(record);
		setPopupParams({isEditVisible : true, record});

	}

	function closePopup() {
		setPopupParams({isEditVisible : false, record : {...emptyRecord}});		
	}

	async function saveRecord() {
		const rec = {
			id : popupParams.record.id,
			name : popupParams.record.name,
			parentId : popupParams.record.selectedParId,
		};
		try {
			const res = await client({
				method : 'POST',
				path : path,
				entity : rec,
				headers : {
					'Content-Type' : 'application/json',
				}
			});
		}
		catch(e) {
			console.log("saveRecord::"+e);
		}

		//console.log(popupParams);
	}



	return(
		<div>
			<CustomButton 
				onClick={openPopupNew}>Создать
			</CustomButton>
			<Modal 
				isVisible={popupParams.isEditVisible} 
				close={closePopup}
			>
				<EditForm 
					cancel={closePopup}
					save={saveRecord}
					record={popupParams.record}
					change={setPopupParams}
				/>
			</Modal>
			<List 
				records={response.entity?.productCategories} 
				columns={['Название','Родительская категория']} 
				editRecord={openPopupEdit}
			/>
			<PageControl 
				curPage={page} 
				totalPages={response.entity?.totalPages} 
				gotoPage={setPage}
			/>
		</div>

	)

}

export default ProductCategoriesAdministration;

/*

export default class ProductCategoriesAdministration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRecord : {},
			response : {},
			mode : 'EDIT',
			newRecord : {
				name : '',
				parent : '',
			},
			modalActive : false,
		};
		this.gotoLastPage = this.gotoLastPage.bind(this);
		this.gotoFirstPage = this.gotoFirstPage.bind(this);
		this.gotoPrevPage = this.gotoPrevPage.bind(this);
		this.gotoNextPage = this.gotoNextPage.bind(this);
		this.saveNewRecord = this.saveNewRecord.bind(this);
		this.createNewRecord = this.createNewRecord.bind(this);
		this.cancelNewRecord = this.cancelNewRecord.bind(this);
		this.newRecordNameChange = this.newRecordNameChange.bind(this);
		this.parentChangeNew = this.parentChangeNew.bind(this);
		this.pickListChange = this.pickListChange.bind(this);
		this.nameChange = this.nameChange.bind(this);
		this.nameBlur = this.nameBlur.bind(this);
		this.controlFocus = this.controlFocus.bind(this);
		this.openModal = this.openModal.bind(this);
	}
	componentDidMount() {
		this.getData();
	}
	getData(page='0', pageSize=defaultPageSize, mode='EDIT') {
		let pageParam = '?page='+page;
		let sizeParam = '&size='+pageSize;
		client({method : 'GET', path : path+pageParam+sizeParam}).then(response => {
			this.setState({
				response : response,
				mode : mode,
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
			newRecord : {
				name : '',
				parent : '',
				parentId : '',
			},
			
		});
	}
	newRecordNameChange(e) {
		const newRecord = {...this.state.newRecord};
		newRecord.name = e.target.value;
		this.setState({
			newRecord : newRecord,
		});
	}
	parentChangeNew(e) {
		if (e.target.value != '') {
			//for ()
			console.log("test");	
		}
		this.setState({
			newRecord : {
				name : this.state.newRecord.name,
				parent : e.target.value,
			},
		});
	}
	pickListChange(e,i) {
		const newRecord = {
			id : this.state.response.entity.productCategories[i].id,
			name : this.state.response.entity.productCategories[i].name,
			parent : e.target.value == '' ? null : {
				id : e.target.value,
				name : e.target.selectedOptions[0].innerText,
			},
		};
		let newResponse = {...this.state.response};
		newResponse.entity.productCategories[i] = newRecord;
		this.setState({
			response : newResponse,
		});
	}
	pickListBlur(e,i) {
		console.log("picklist blur "+i);
		this.saveRecord(i);
	}
	saveRecord(i) {
		console.log("save record="+i);
		let modifiedEntity = this.state.response.entity.productCategories[i];
		client({
			method : 'PUT',
			path : path+'/'+this.state.response.entity.productCategories[i].id,
			entity : this.state.response.entity.productCategories[i],
			headers : {
				'Content-Type' : 'application/json',
			}
		})
	}
	nameChange(e,i) {
		console.log("name change"+e.target.value+" "+i);
		const newResponse = {...this.state.response};
		newResponse.entity.productCategories[i].name = e.target.value;
		this.setState({
			response : newResponse,
		});
	}
	nameFocus(e,i) {
		this.fillSelectedRecord(i);
		
	}
	parentFocus() {
		console.log("parentFocus");
	}
	controlFocus(rowIndex) {
		console.log("focus on = "+rowIndex.valueOf());
		console.log("this.state.selectedRecord.rowNum = "+this.state.selectedRecord.rowNum);
		console.log(this.state.selectedRecord.rowNum == true);
		if (rowIndex.valueOf() == this.state.selectedRecord.rowNum?.valueOf()) {
			console.log("та же запись, не сохраняем");
		}
		else {
			console.log("другая запись")
		}
		this.fillSelectedRecord(rowIndex);
	}
	fillSelectedRecord(rowIndex) {
		this.setState({
			selectedRecord : {
				rowNum : rowIndex,
				name : this.state.response.entity.productCategories[rowIndex].name,
				id : this.state.response.entity.productCategories[rowIndex].id,
				parent : {
					id : this.state.response.entity.productCategories[rowIndex].parent?.id,
					name : this.state.response.entity.productCategories[rowIndex].parent?.name,
				}
			}
		});
	}
	nameBlur() {
		//console.log("name blur");
	}

	openModal() {
		this.setState({
			modalActive : true,
		})
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
			<tbody>{header}
			{records.map((row,i) => 
			<tr 
				key={row.id}
			>
				<td>
					<input 
						type='text' 
						value={row.name} 
						onChange={e => this.nameChange(e,i)} 
						onFocus={() => this.controlFocus(i)}
						onBlur={this.nameBlur}
					/>
				</td>
				<td>
					<PickList 
						selectedItem={row.parent} 
						onChange={e => this.pickListChange(e,i)} 
						onBlur={e => this.pickListBlur(e,i)}
						onFocus={() => this.controlFocus(i)}
					/>
				</td>
			</tr>)}</tbody>
		</table>

		const newRecordTable = <table className="content-table">
			{header}
			<tr>
				<td><input type='text' value={this.state.newRecord.name} onChange={this.newRecordNameChange}/></td>
				<td><PickList onChange={this.parentChangeNew} selectedVal={this.state.newRecord.parent}/></td>
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
			<Modal isVisible={this.state.modalActive}>
				<EditForm />
			</Modal>
			<MyButton onClick={this.openModal}>поднять окно</MyButton>
			{topControls}
			{this.state.mode == 'EDIT' ? editRecordsTable : newRecordTable}
		</div>
	}


	
}

class PickList extends React.Component {
	constructor(props) {
		super(props);
		console.log("constructor invoke");
		this.state = {
			response : {},
			mode : 'SINGLE_ITEM',
		};
		this.onFocus = this.onFocus.bind(this);
		//this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	componentDidMount() {

	}
	onFocus(e) {
		client({method : 'GET', path : getAvailableParentsPath}).then(response => {
			this.setState({
				response : response,
				mode : 'MULTI_ITEMS',
			});
		});
		this.props.onFocus();

	}
	onBlur1(e) {
		console.log("onblur");
		/*
		this.setState({
			mode : 'SINGLE_ITEM',
		})
		*/
		
/*	}
	onChange(e) {
		this.setState({
			mode : 'SINGLE_ITEM',
		});
		this.props.onChange(e);
	}

	render() {
		//console.log("MODE="+this.state.mode);
		const selectedName = this.props.selectedItem ? this.props.selectedItem.name : '';
		const selectedId = this.props.selectedItem ? this.props.selectedItem.id : '';
		return(
			this.state.mode =='SINGLE_ITEM' ?
			<select className="picklist" size='1' onFocus={this.onFocus}><option>{selectedName}</option></select>
			: 
			this.state.response.entity ? 
			<select className="picklist" size='1' onFocus={this.onFocus} onBlur={this.onBlur1} onChange={this.onChange}>
				{<option value=""></option>}
				{this.state.response.entity.map((elem) => <option key={elem.id} value={elem.id}>{elem.name}</option>)}
			</select> : null
			
		);
	}
}

*/