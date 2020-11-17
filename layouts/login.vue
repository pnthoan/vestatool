<template>
  <v-app light>
    <v-app-bar
      fixed
      app
    >
       <v-toolbar-title style="color:#3f51b5;" v-text="title" />
      <vuetify-logo />
      <v-spacer></v-spacer>
      <v-btn icon @click="onLogin()"><v-icon>mdi-login-variant</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-container style="width:100%;max-width:100%">
        <nuxt />
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
      style="text-align: center;"
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import VuetifyLogo from '~/components/VuetifyLogo.vue'
export default {
  data () {
    return {
      title: 'Ebox',
      fixed: false,
    }
  },
  components: {
    VuetifyLogo
  },
  methods: {
    onLogin() {
      this.$router.push('/login')
    }
  }
};
</script>
<style type="text/css">
.v-btn--round .v-btn__content .v-icon {
  color: #1E88E5;
}
</style>