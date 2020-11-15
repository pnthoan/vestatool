<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon style="color:#1E88E5">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
        v-show="drawer"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title style="color:#3f51b5;" v-text="title" />
      <vuetify-logo />
      <v-spacer></v-spacer>
      <v-btn icon><v-icon>mdi-logout-variant</v-icon></v-btn>
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
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Tính Giá',
          to: '/tinhgia'
        },
        {
          icon: 'mdi-note-outline',
          title: 'Giấy',
          to: '/giay'
        },
        {
          icon: 'mdi-dropbox',
          title: 'Hộp',
          to: '/hop'
        },
        {
          icon: 'mdi-currency-usd',
          title: 'Tỉ Lệ LN',
          to: '/tileloinhuan'
        },
        {
          icon: 'mdi-account-group',
          title: 'Nhân Viên',
          to: '/nhanvien'
        }
      ],
      miniVariant: false,
      title: 'Ebox'
    }
  },
  components: {
    VuetifyLogo
  }
};
</script>
<style type="text/css">
.v-btn--round .v-btn__content .v-icon {
  color: #1E88E5;
}
</style>