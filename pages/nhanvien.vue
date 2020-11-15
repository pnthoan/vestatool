<template>
  <div style="width:100%">
    <div>
      <div class="center">
        <v-btn class="mx-2" outlined fab color="indigo" @click="addItem()">
          <v-icon dark >mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
  <br>
  <v-data-table
    :headers="headers"
    :items="desserts"
  >
    <template v-slot:top>
        <v-dialog
          v-model="dialog"
          max-width="80%"
        >
          <v-card>
            <v-card-title>
              <span class="headline" style="color:blue;">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.username"
                      label="Username"
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="editedIndex==-1" cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.password"
                      label="Password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      v-model="editedItem.role"
                      :items="roles"
                      label="Role"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Phone"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.address"
                      label="Address"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn small class="mr-2" outlined fab color="primary" @click="editItem(item)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn small class="mr-2" outlined fab color="primary" @click="deleteItem(item)">
        <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
  </div>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Username', value: 'username', class: 'username-size'},
        { text: 'Name', value: 'name', class: 'name-size'},
        { text: 'Role', value: 'role', class: 'role-size' },
        { text: 'Email', value: 'email', class: 'email-size' },
        { text: 'Phone', value: 'phone', class: 'phone-size' },
        { text: 'Address', value: 'address', class: 'add-size'},
        { text: 'Actions', value: 'actions', class: 'actions-size', sortable: false }
      ],
      roles: ['Admin', 'Member'],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        username: '',
        password: '',
        name: '',
        role: '',
        email: '',
        phone: '',
        address: ''
      },
      defaultItem: {
        username: '',
        password: '',
        name: '',
        role: '',
        email: '',
        phone: '',
        address: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Add' : 'Edit'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = [
          {
            username : 'pnthoan',
            name : 'Pham Ngoc Thoan',
            role : 'Admin',
            email : 'pnthoan@gmail.com',
            phone : '0932159064',
            address : 'Binh Phuoc'
          },
          {
            username : 'ntlhuyen',
            name : 'Nguyen Thi Le Huyen',
            role : 'Member',
            email : 'ntlhuyen@gmail.com',
            phone : '0932159064',
            address : 'Binh Duong'
          }
        ]
      },

      addItem() {
        console.log("Add new item");
        this.editedIndex = -1;
        this.dialog = true;
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
    },
  };
</script>

<style type="text/css">
.username-size {
  padding: 0 0px !important;
  width: 10%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.name-size {
  padding: 0 0px !important;
  width: 15%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.role-size {
  padding: 0 0px !important;
  width: 10%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.email-size {
  padding: 0 0px !important;
  width: 15%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.phone-size {
  padding: 0 0px !important;
  width: 10%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.add-size {
  padding: 0 0px !important;
  width: 20%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.actions-size {
  padding: 0 0px !important;
  width: 10%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  text-align: left !important;
  padding: 0 0px !important;
}

.center {
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>