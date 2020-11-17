<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="80%"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline" style="color:#1E88E5;">Login</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                required
              ></v-text-field>
            </v-row>
            <v-row>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                required
              ></v-text-field>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="onClose">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="onSubmit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="alert" max-width="50%">
      <v-alert type="error">
        Wrong Username or Password!
      </v-alert>
    </v-dialog>
    </div>
</template>

<script>
  export default {
    layout: 'login',
    data: () => ({
      dialog: true,
      alert: false,
      username: '',
      password: '',
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ],
    }),

    methods: {
      onClose() {
        console.log("onClose function!");
        this.dialog = false;
        this.$router.push('/')
      }, 

      async onSubmit({$axios, $cookies})
      {
        if (!this.username || !this.password) {
          console.log("Username or Password is not correct!")
          return;
        }
        console.log("On Submit function!");
        // console.log(this.username + ":" + this.password);
        const userdata = {username: this.username, password: this.password};
        await this.$axios.post('/api/login', userdata)
        .then(res => {
          // console.log(JSON.stringify(res.data))
          this.$cookies.set('token', res.data.token, {sameSite:'None'});
          this.$cookies.set('username', res.data.username, {sameSite:'None'});
          this.$cookies.set('name', res.data.name, {sameSite:'None'});
          this.$cookies.set('role', res.data.role, {sameSite:'None'});

          this.$router.push('/tinhgia')
        })
        .catch(err => {
            console.log("Login Failed!");
            this.alert = true;
            setTimeout(()=>{
                  this.alert=false
            },1500)
            this.$router.push('/login')
        })
      }
    },
  };
</script>