module.exports = (api, rootPath, relArray) => {
	const root = api({method : 'GET', path : rootPath,});
	return relArray.reduce((root, arrayItem) => {
		const rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel;
		return traverseNext(root, rel, arrayItem);
	}, root);

};