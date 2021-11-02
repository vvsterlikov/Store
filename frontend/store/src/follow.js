module.exports = (api, rootPath, relArray) => {
	
	const root = api({method : 'GET', path : rootPath,}); //promise
	
	return relArray.reduce((root, arrayItem) => {
		const rel = typeof arrayItem === 'string' ? arrayItem : arrayItem.rel;
		return traverseNext(root, rel, arrayItem);
	}, root);
	
	function traverseNext(root, rel, arrayItem) {
		return root.then(response => {
			console.log("1");/////run here
			if (hasEmbeddedRel(response.entity, rel)) {
				console.log("2");
				return response.entity._embedded[rel];
			}
			console.log("3");//////
			if (!response.entity._links) {
				console.log("4");
				return [];
			}
			console.log("5");//////
			if (typeof arrayItem === 'string') {
				console.log("6");
				return api({method : 'GET', path : response.entity._links[rel].href});
			} else {
				console.log("7");///////
				return api ({
					method: 'GET', path : response.entity._links[rel].href, params : arrayItem.params,
				});
			}
			console.log("8");
		});
	}
	
	function hasEmbeddedRel(entity, rel) {
		return entity._embedded && entity._embedded.hasOwnProperty(rel);
	}


};