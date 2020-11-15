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
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.ma_giay"
                      label="Mã Giấy"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.ten_giay"
                      label="Tên Giấy"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.don_gia"
                      label="Đơn Giá"
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
        { text: 'Mã Giấy', value: 'ma_giay', class: 'ma-giay-class'},
        { text: 'Tên Giấy', value: 'ten_giay', class: 'ten-giay-class' },
        { text: 'Đơn Giá', value: 'don_gia', class: 'don-gia-class'},
        { text: 'Actions', value: 'actions', class: 'actions-class', sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        ma_giay: '',
        ten_giay: '',
        don_gia: 0.0
      },

      defaultItem: {
        ma_giay: '',
        ten_giay: '',
        don_gia: 0.0
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
        this.items = [
          {
            ma_giay: '2N3X',
            ten_giay: 'Giấy 5 lớp 2N3X',
            don_gia: 9700
          },
          {
            ma_giay: '2N1X',
            ten_giay: 'Giấy 3 lớp 2N1X',
            don_gia: 7400
          }
        ]
      },

      addItem() {
        console.log("Add new item");
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

      deleteItemConfirm () {
        this.items.splice(this.editedIndex, 1)
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
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else {
          this.items.push(this.editedItem)
        }
        this.close()
      },
    },
  };
</script>

<style type="text/css">
.ma-giay-class {
  padding: 0 0px !important;
  width: 30%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}

.don-gia-class {
  padding: 0 0px !important;
  width: 30%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}

.ten-giay-class {
  padding: 0 0px !important;
  width: 30%;
  color: #3f51b5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}

.actions-class {
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