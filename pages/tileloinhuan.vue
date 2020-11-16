<template>
  <div style="width:100%">
    <v-row justify="center">
      <v-col cols="10" sm="4">
          <v-select
            v-model="loai_hop"
            :items="list_hop"
            menu-props="auto"
            label="Select"
            hide-details
            prepend-icon="mdi-dropbox"
            single-line
          ></v-select>
      </v-col>
    </v-row>
    <br>

    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.loai_hop"
      >
        <v-list-item-content>
          <v-container class="grey lighten-3">
            <v-row>
                <h4 style="color:#1E88E5;">Số Lớp {{item.so_lop}}</h4>
                <v-spacer></v-spacer>
                <v-btn small class="mr-2" outlined fab color="primary" @click="editItem(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn small class="mr-2" outlined fab color="primary" @click="deleteItem(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-row>
            <v-row
              v-for="k in 4"
              :key="k"
            >
              <v-col
                v-for="n in 4"
                :key="n"
              >
                <v-card
                  class="pa-2"
                  tile
                  outlined
                >
                  col
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <br>
    <div>
      <div class="center">
        <v-btn class="mr-2" outlined fab color="indigo" @click="addItem()">
          <v-icon dark >mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>


    <v-dialog
      v-model="dialog"
      max-width="80%"
    >
      <v-card>
        <v-card-title>
          <span class="headline" style="color:#1E88E5;">{{ formTitle }}</span>
          <v-spacer></v-spacer>
          <span>
            <v-btn class="ma-2" outlined color="indigo" dark @click="exportFunc">Export</v-btn>
            <v-btn class="ma-2" outlined color="indigo" dark @click="importFunc">Import</v-btn>
          </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-if="editedIndex===-1" cols="12" sm="2">
                <v-select
                    v-model="so_lop"
                    :items="solops"
                    label="Số Lớp"
                  ></v-select>
              </v-col>
              <v-col cols="12" sm="10">
                <v-container class="grey lighten-2">
                  <v-row
                    v-for="k in 4"
                    :key="k"
                  >
                    <v-col
                      v-for="n in 4"
                      :key="n"
                    >
                      <v-card
                        class="pa-2"
                        tile
                        outlined
                      >
                        col
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
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

    <v-dialog v-model="dialog_import" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline" style="color:#1E88E5;">Import</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-file-input
              v-model="files"
              color="deep-purple accent-4"
              counter
              label="File input"
              multiple
              placeholder="Select your files"
              prepend-icon="mdi-paperclip"
              outlined
              :show-size="1000"
            >
              <template v-slot:selection="{ index, text }">
                <v-chip
                  v-if="index < 2"
                  color="deep-purple accent-4"
                  dark
                  label
                  small
                >
                  {{ text }}
                </v-chip>

                <span
                  v-else-if="index === 2"
                  class="overline grey--text text--darken-3 mx-2"
                >
                  +{{ files.length - 2 }} File(s)
                </span>
              </template>
            </v-file-input>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog_import=false"
          >
            Close
          </v-btn>
          <v-btn
            :loading="loading"
            :disabled="loading"
            color="blue darken-1"
            text
            @click="upload"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      loading: false,
      dialog_import: false,
      dialogDelete: false,
      headers: [
        { text: 'Số Lớp', value: 'so_lop', class: 'loai-hop-class'},
        { text: 'Actions', value: 'actions', class: 'actions-size', sortable: false }
      ],
      items: [],
      files: [],
      so_lop: 'All',
      solops:['3', '5', '7', 'All'],
      loai_hop: 'hop A',
      list_hop:['hop A', 'hop B'],
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
        return this.editedIndex === -1 ? 'Add ' + this.loai_hop : 'Edit ' + this.loai_hop
      },
    },

    // watch: {
    //   dialog (val) {
    //     val || this.close()
    //   },
    //   dialogDelete (val) {
    //     val || this.closeDelete()
    //   },
    // },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.items = [
          {
            so_lop: '3',
            ti_le_ln: '((c + r) + 5) * ((d + r) * 2 + 5)* g * 1.1/10000'
          },
          {
            so_lop: '3',
            ti_le_ln: '((c + r)+5)*((d + r)*2+5)* g*1.15/10000'
          }
        ]
      },

      addItem() {
        console.log("Add new item");
        this.editedIndex = -1;
        this.dialog = true;
      },

      editItem (item) {
        console.log(JSON.stringify(item))
        this.editedIndex = this.items.indexOf(item)
        // this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
        // this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.items.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      // close () {
      //   this.dialog = false
      //   console.log("closeFunc")
      //   // this.$nextTick(() => {
      //   //   this.editedItem = Object.assign({}, this.defaultItem)
      //   //   this.editedIndex = -1
      //   // })
      // },

      closeDelete () {
        this.dialogDelete = false
        console.log("closeDeleteFunc")
        // this.$nextTick(() => {
        //   this.editedItem = Object.assign({}, this.defaultItem)
        //   this.editedIndex = -1
        // })
      },

      save () {
        console.log("save function")
        // if (this.editedIndex > -1) {
        //   Object.assign(this.items[this.editedIndex], this.editedItem)
        // } else {
        //   this.items.push(this.editedItem)
        // }
        // this.close()
      },
      exportFunc(){
        console.log("exportFunc")
      },
      importFunc(){
        this.dialog_import = true;
        console.log("importFunc")
      },
      async upload () {
        console.log("Upload")
        this.loading = true;
        for (let file of this.files) {
          console.log(file.name)
          console.log(process.cwd())

          var reader = new FileReader();
          var printEventType = function(event) {
            console.log('got event: ' + event.type);
          };

          reader.onloadstart = printEventType;
          reader.onprogress = printEventType;
          reader.onload = printEventType;
          reader.onabort = printEventType;
          reader.onerror = printEventType;

          reader.onloadend = async function (e) {
            const dataURL = reader.result;
            let formData = new FormData();
            formData.data = dataURL;
            // console.log(JSON.stringify(formData));
            await axios.post('http://192.168.120.5:3000/upload',
                    {
                      data : formData,
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      },
                      file: file.name
                    }
                )
            .then(function(res) {
              console.log('SUCCESS!!');
              console.log(JSON.stringify(res.data));
            })
            .catch(function(){
              console.log('FAILURE!!');
            });
          }

          if (file) {
            reader.readAsDataURL(file);
          }

        }

        // this.dialog = false;
        setTimeout(this.close(), 3000)
      },

      close () {
        console.log("Close");
        this.loading = false;
        this.dialog = false;
      },

    },
  };
</script>

<style type="text/css">
.loai-hop-class {
  padding: 0 0px !important;
  width: 25%;
  color: #1E88E5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}
.cong-thuc-class {
  padding: 0 0px !important;
  width: 60%;
  color: #1E88E5 !important;
  text-align: left !important;
  background-color: LightGray !important;
}

.actions-size {
  padding: 0 0px !important;
  width: 15%;
  color: #1E88E5 !important;
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
.v-icon.v-icon {
  color: #1E88E5;
}
</style>