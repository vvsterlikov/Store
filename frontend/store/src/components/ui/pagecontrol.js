import React from 'react';

const PageControl = ({curPage, totalPages, gotoPage}) => {
	const labels = {
		first : '<<',
		prev : '<',
		next : '>',
		last : '>>',
	}
	return (
		<div>
			<button disabled={curPage==0} onClick={() => gotoPage(0)}>{labels.first}</button>
			<button disabled={curPage==0} onClick={() => gotoPage(curPage-1)}>{labels.prev}</button>
			Страница {curPage+1} из {totalPages}
			<button disabled={curPage==totalPages-1} onClick={() => gotoPage(curPage+1)}>{labels.next}</button>
			<button disabled={curPage==totalPages-1} onClick={() => gotoPage(totalPages-1)}>{labels.last}</button>
		</div>
	)
}

export default PageControl;