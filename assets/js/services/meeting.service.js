const meetingService = {
	findByUser: user => {
		return firebase.firestore()
			.collection('meetings')
			.where('user.uid', '==', user.uid) //filtro
			.orderBy('date', 'asc')
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
			.collection("meetings")
			.doc(uid)
			.delete();
	},
	save: register => {
		return firebase.firestore()
	  		.collection('meetings')
	   		.add(register);
	},
	update: register => {
		return firebase.firestore()
		    .collection("meetings")
		    .doc(uid)
		    .update(register);
	}
}