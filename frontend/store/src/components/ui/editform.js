import React from 'react';

const EditForm = ({cancel, save, record, change}) => {
	function changeName(e) {
		const newPopupParams = {
			isEditVisible :  true,
			record 	: {
				...record,
				name : e.target.value,
			}
		};
		change(newPopupParams);

	}
	function changeParent(e) {
		const newPopupParams = {
			isEditVisible : true,
			record : {
				...record,
				selectedParId : e.target.value,
				selectedParName : e.target.selectedOptions[0].label,
			}
		}
		change(newPopupParams);
	}
	return(
		<div>
		<table>
			<tr>
				<th>Название</th>
				<th>Родительская категория</th>
			</tr>
			<tr>
				<td>
					<input 
						type="text" 
						value={record.name} 
						onChange={changeName}
					/>
				</td>
				<td>
					<select 
						style={{width : '200px'}} 
						size='1' 
						onChange={changeParent}
						defaultValue={record.selectedParName}
					>
						<option
						></option>
						{record.parent 
						? 
						record.parent.map(par =>
							<option 
								key={par.id}
								value={par.id}
							>
							{par.name}
							</option>)
						: 
						null}
					</select>
				</td>
			</tr>
		</table>
		<button onClick={save}>Сохранить</button>
		<button onClick={cancel}>Отмена</button>
		</div>
	)

}
 	 	
export default EditForm;