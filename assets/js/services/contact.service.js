const contactService = {
	findByUser: user => {
		return firebase.firestore()
			.collection('contacts')
			.where('user.uid', '==', user.uid) //filtro
			.orderBy('date', 'desc')
			.get()
			.then(snapshot => {
				return snapshot.docs.map(doc => ({
					...doc.data(),
					uid: doc.id
				}));
			})
	},
	remove: register => {
		return firebase.firestore()
			.collection("contacts")
			.doc(uid)
			.delete();
	},
	save: register => {
		return firebase.firestore()
	  		.collection('contacts')
	   		.add(register);
	},
	update: register => {
		return firebase.firestore()
		    .collection("contacts")
		    .doc(uid)
		    .update(register);
	}
}