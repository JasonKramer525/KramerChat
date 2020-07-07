<template>
  <q-page ref="pageChat" class="page-chat flex column">
  	<q-banner v-if="!otherUserDetails.online" class="fixed-top text-center bg-grey-4">
  	      {{ otherUserDetails.name }} is offline.
  	</q-banner>
  	<q-banner v-else class="fixed-top text-center bg-green-4">
  	      {{ otherUserDetails.name }} is online.
  	</q-banner>
  	<div :class="{'invisible' : !showMessages}" class="q-pa-md column col justify-end">
  		<q-chat-message
  		v-for="(message,key) in messages"
  		:name="message.from == 'me' ? userDetails.name :otherUserDetails.name"
        :text="[message.text]"
        :key="key"
        :sent="message.from == 'me' ? true : false"
        :bg-color="message.from == 'me' ? 'white' : 'light-green-2'"
      />
  	</div>

 	 <q-footer elevated>
 	   <q-toolbar>
	 	 <q-form @submit="sendMessage" class="full-width">   
	 	     <q-input bg-color="white" outlined rounded ref="newMessage" v-model="newMessage" label="Message" dense>
	 	     	<template v-slot:after>
	 	        	<q-btn @click="sendMessage"round dense flat color="white" icon="send" flat />
	 	        </template>
	 	      </q-input>
 	      </q-form>
 	   </q-toolbar>
 	 </q-footer>
  </q-page>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'

export default {
	mixins: [mixinOtherUserDetails],
	data(){
		return {
			newMessage: '',
			showMessages: false
		}
	},
	computed: {
		...mapState('store', ['messages', 'userDetails']),
	},
	methods: {
		...mapActions('store', ['firebaseGetMessages', 'firebaseStopGettingMessages','firebaseSendMessage']),
		sendMessage() {
			this.firebaseSendMessage({
				message: {
					text: this.newMessage,
					from: 'me'
				},
				otherUserId: this.$route.params.otherUserId
			})
			this.clearMessage()
		},
		clearMessage(){
			this.newMessage = ''
			this.$refs.newMessage.focus()
		},
		scrollToBottom(){
			let pageChat = this.$refs.pageChat.$el
			setTimeout(() => {
				window.scrollTo(0,pageChat.scrollHeight)
			},20);
		}
	},
	mounted(){
		this.firebaseGetMessages(this.$route.params.otherUserId)
	},
	watch: {
		messages: function(val) {
			if(Object.keys(val).length){
				this.scrollToBottom()
				setTimeout(() => {
					this.showMessages = true
				},200);
			}
		}
	},
	destroyed(){
		this.firebaseStopGettingMessages()
	}
}
</script>

<style lang ="stylus">
	.page-chat
		background gray
	.q-banner
		top 50px
		z-index 2
		opacity .8
</style>
		