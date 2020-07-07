import Vue from 'vue'
import { firebaseAuth, firebaseDb } from 'boot/firebase'

let messagesRef

const state = {
	userDetails: {},
	users: {},
	messages: {}
}
const mutations = {
	setUserDetails(state, payload) {
		state.userDetails = payload
	},
	addUser(state,payload){
		Vue.set(state.users, payload.userId, payload.userDetails)
	},
	updateUser(state,payload){
		Object.assign(state.users[payload.userId], payload.userDetails)
	},
	addMessage(state,payload){
		Vue.set(state.messages, payload.messageId, payload.messageDetails)
	},
	clearMessages(state){
		state.messages = {}
	}
}
const actions = {
	registerUser({},payload){
		firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
			.then(response => {
				let userId = firebaseAuth.currentUser.uid;
				firebaseDb.ref('users/' + userId).set({
					name: payload.name,
					email: payload.email,
					color: payload.color,
					online: true
				})
			})
			.catch(error => {
				console.log(error.message)
			})
	},
	loginUser({},payload){
		firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.log(error.message)
			})
	},
	logoutUser(){
		firebaseAuth.signOut()
	},
	handleAuthStateChanged({ commit, dispatch, state }){
		firebaseAuth.onAuthStateChanged(user => {
		if (user) {
		    // User is signed in.
		    let userId = firebaseAuth.currentUser.uid;
		    firebaseDb.ref('users/' + userId).once('value', snapshot => { 
		    	let userDetails = snapshot.val()
		    	commit('setUserDetails', {
		    		name: userDetails.name,
		    		email: userDetails.email,
		    		color: userDetails.color,
		    		userId: userId
		    	})
		    }) 
		    dispatch('firebaseUpdateUser', {
		    	userId: userId,
		    	updates: {
		    		online: true
		    	}
		    })
		    dispatch('firebaseGetUsers')
		    this.$router.push('/').catch(err => {})
		  }
		else {
			// User is signed out
	    	 dispatch('firebaseUpdateUser', {
		    	userId: state.userDetails.userId,
		    	updates: {
		    		online: false
		    	}
		    })
		  	this.$router.replace('/auth').catch(err => {})
	    	commit('setUserDetails', {})
		}
		});
	},
	firebaseUpdateUser({}, payload){
		if(payload.userId){
			firebaseDb.ref('users/' + payload.userId).update(payload.updates)
		}
	},
	firebaseGetUsers({commit}){
		firebaseDb.ref('users').on('child_added', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('addUser', {
				userId,
				userDetails
			})
		})
		firebaseDb.ref('users').on('child_changed', snapshot => {
			let userDetails = snapshot.val()
			let userId = snapshot.key
			commit('updateUser', {
				userId,
				userDetails
			})
		})
	},
	firebaseGetMessages({state, commit}, otherUserId){
		let userId = state.userDetails.userId
		messagesRef = firebaseDb.ref('chats/' + userId + '/' + otherUserId)
		messagesRef.on('child_added', 
			snapshot => {
			let messageDetails = snapshot.val()
			let messageId = snapshot.key
			commit('addMessage', {
				messageId,
				messageDetails
			})
		})
	},
	firebaseStopGettingMessages({commit}){
		if(messagesRef){
			messagesRef.off('child_added')
			commit('clearMessages')
		}
	},
	firebaseSendMessage({}, payload){
		firebaseDb.ref('chats/' + state.userDetails.userId + '/' + payload.otherUserId)
			.push(payload.message)

		payload.message.from = 'them'

		firebaseDb.ref('chats/' + payload.otherUserId + '/' + state.userDetails.userId)
			.push(payload.message)
	},
	firebaseChangeColor({dispatch}, color){
		dispatch('firebaseUpdateUser', {
		    	userId: state.userDetails.userId,
		    	updates: {
		    		color: color
		    	}
		})
	}
}
const getters = {
	users: state => {
		let usersFiltered = {}
		Object.keys(state.users).forEach(key => {
			if(key !== state.userDetails.userId){
				usersFiltered[key] = state.users[key]
			}
		})
		return usersFiltered
	},
	currentDetails: state => {
		return state.users[state.userDetails.userId]
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}