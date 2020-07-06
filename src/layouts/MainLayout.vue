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

        <q-btn class="absolute-right q-pr-sm" v-if="!userDetails.userId"
          to="/auth" icon="account_circle" label="Login" flat dense no-caps/>
         <q-btn class="absolute-right q-pr-sm" v-else
          icon="account_circle" flat dense no-caps @click="logoutUser">Logout<br> {{ userDetails.name }} </q-btn>

      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
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
      if(currentPath == '/') return 'SmackChat'
      else if(currentPath.includes('/chat')) return this.otherUserDetails.name
      else if(currentPath == '/auth') return 'Login'
    } 
  },
  methods: {
    ...mapActions('store',['logoutUser'])
  }
  
}
</script>

<style lang="stylus">
  .q-toolbar
    .q-btn
      line-height:1.2
</style>