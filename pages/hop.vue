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
    :items="items"
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
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="editedItem.loai_hop"
                      label="Loại Hộp"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="9">
                    <v-text-field
                      v-model="editedItem.cong_thuc"
                      label="Công Thức"
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
        { text: 'Loại Hộp', value: 'loai_hop', class: 'loai-hop-class'},
        { text: 'Công Thức', value: 'cong_thuc', class: 'cong-thuc-class'},
        { text: 'Actions', value: 'actions', class: 'actions-size', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        loai_hop: '',
        cong_thuc: ''
      },
      defaultItem: {
        loai_hop: '',
        cong_thuc: ''
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

    async asyncData({ $axios, $cookies }) {
      // const token = $cookies.get('token')
      // console.log(token)
      const hops = await $axios.$get('/api/hop')
      let item = []
      var ele
      for (ele of hops) {
        item.push(ele)
      }
      return {items: item};
    },

    methods: {
      addItem() {
        this.editedIndex = -1;
        this.dialog = true;
      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        await this.$axios.delete('/api/hop/' + this.editedItem._id)
        .then(res => {
          this.items.splice(this.editedIndex, 1)
          this.closeDelete()
        })
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

      async save ({ $axios }) {
        if (this.editedIndex > -1) {
          let item = this.items[this.editedIndex]
          await this.$axios.put('/api/hop/' + item._id, {
            "loai_hop": this.editedItem.loai_hop,
            "cong_thuc": this.editedItem.cong_thuc
          })
          .then(res => {
            // console.log(res.data)
            Object.assign(this.items[this.editedIndex], res.data)
          })
        } else {
          await this.$axios.post('/api/hop', {
            "loai_hop": this.editedItem.loai_hop,
            "cong_thuc": this.editedItem.cong_thuc
          })
          .then(res => {
            this.items.push(res.data)
          })
        }
        this.close()
      },
    },
  };
</script>

<style type="text/css">
.loai-hop-class {
  padding: 0 0px !important;
  width: 25%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.cong-thuc-class {
  padding: 0 0px !important;
  width: 60%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}

.actions-size {
  padding: 0 0px !important;
  width: 15%;
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