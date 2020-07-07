<template>
	<q-form @submit="submitForm">
		<q-input v-if="tab=='register'" class="q-mb-md" v-model="formData.name" outlined label="Name" />
		<q-input class="q-mb-md" v-model="formData.email" outlined label="Email" type="email"/>
		<q-input class="q-mb-md" v-model="formData.password" outlined label="Password" type="password"/>
		<div class = "row">
			<q-space />
			<q-btn color="primary" :label="tab" type="submit"/>
		</div>
	</q-form>
</template>

<script>
	import {mapActions} from 'vuex'

	export default {
		props: ['tab'],
		data() {
			return {
				formData: {
					name: '',
					email: '',
					password: '',
					color: 'primary'
				}
			}
		},
		methods: {
			...mapActions('store',['registerUser', 'loginUser']),
			submitForm(){
				if(this.tab == 'login')
					this.loginUser(this.formData)
				else
					this.registerUser(this.formData)
			}
		}
	}
</script>