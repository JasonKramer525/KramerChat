<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn 
          v-if="$route.fullPath.includes('/chat')" 
          icon="arrow_back" label="Back" flat dense v-go-back.single/>

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

        <q-btn class="q-mr-xs" icon="settings" flat dense @click="confirm = true" v-if="$route.fullPath == '/'"/>
                <q-space />
        <q-btn class="q-pr-sm" v-if="!userDetails.userId"
          to="/auth" icon="account_circle" label="Login" flat dense no-caps/>
          <q-btn class="q-pr-sm" v-if="userDetails.userId"
          icon="account_circle" flat dense no-caps @click="logoutUser">Logout<br> {{ userDetails.name }} </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />

      <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="settings" color="primary" text-color="white" />
          <q-toolbar-title>Settings</q-toolbar-title>    
        </q-card-section>
        <q-card-section class="q-pt-none">
          Current Icon: <q-btn v-if="userDetails.userId" round :color="getUserColor">{{ userDetails.name.charAt(0) }}</q-btn> 
        </q-card-section>
        <q-card-section class="q-pt-none">
          Select your icon color:
        </q-card-section>
        <q-card-section class="q-pt-none">
           <q-btn class="q-mr-xs" round color="red-7"/>
           <q-btn class="q-mr-xs" round color="pink-7"/>
           <q-btn class="q-mr-xs" round color="purple-7"/>
           <q-btn class="q-mr-xs" round color="deep-purple-7"/>
           <q-btn class="q-mr-xs" round color="indigo-7"/>
           <q-btn class="q-mr-xs" round color="blue-7"/>
        </q-card-section>
           <q-card-section class="q-pt-none">
           <q-btn class="q-mr-xs" round color="light-blue-7"/>
           <q-btn class="q-mr-xs" round color="cyan-7"/>
           <q-btn class="q-mr-xs" round color="primary"/>
           <q-btn class="q-mr-xs" round color="teal-7"/>
           <q-btn class="q-mr-xs" round color="green-7"/>
           <q-btn class="q-mr-xs" round color="lime-5"/>
        </q-card-section>
        </q-card-section>
           <q-card-section class="q-pt-none">
           <q-btn class="q-mr-xs" round color="yellow-7"/>
           <q-btn class="q-mr-xs" round color="amber-7"/>
           <q-btn class="q-mr-xs" round color="orange-7"/>
           <q-btn class="q-mr-xs" round color="deep-orange-7"/>
           <q-btn class="q-mr-xs" round color="brown-7"/>
           <q-btn class="q-mr-xs" round color="grey-7"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import mixinOtherUserDetails from 'src/mixins/mixin-other-user-details.js'

export default {
  mixins: [mixinOtherUserDetails],
  computed: {
    ...mapState('store', ['userDetails']),
    title() {
      let currentPath = this.$route.fullPath
      if(currentPath == '/') return 'KramerChat'
      else if(currentPath.includes('/chat')) return this.otherUserDetails.name
      else if(currentPath == '/auth') return 'Login'
    },
    getUserColor(){
      console.log("TEST", this.userDetails.color)
      return this.userDetails.color
    }
  },
  methods: {
    ...mapActions('store',['logoutUser'])
  },
  data(){
    return {
      confirm: false,
      color: "green"
    }
  }
  
}
</script>

<style lang="stylus">
  .q-toolbar
    .q-btn
      line-height:1.2
</style>