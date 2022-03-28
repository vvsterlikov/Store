import React from 'react';

const List = ({records,columns,editRecord}) => {
	return(
		<div>
			{records ? 
			<table>
				<tr>
					{columns.map(col => <th key={col}>{col}</th>)}
				</tr>
				{records.map(rec => <tr key={rec.id}>
					<td>{rec.name}</td>
					<td>{rec.parent}</td>
					<td><button onClick={()=>editRecord(rec.id)}>Редактировать</button></td>
				</tr>)}
			</table>
			:
			"Нет записей"
			}

		</div>
	)
}

export default List;