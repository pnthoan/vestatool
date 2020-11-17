<template>
  <v-container>
    <h2 class="text-center" style="color:#1E88E5;">Welcome!</h2>
    <br/>
  </v-container>
</template>

<script>
  export default {
    layout: 'login',
    data: () => ({
      username: '',
      dialog: false,
    }),
    methods: {
      onClose() {
        console.log("onClose function!");
      }, 

      onSubmit()
      {
        console.log("On Submit function!");
      }
    }
  };
</script>

<style type="text/css">
.center {
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>