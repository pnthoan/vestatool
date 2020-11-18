<template>
  <div style="width:100%">
    <v-row justify="center">
      <v-col cols="10" sm="4">
          <v-select
            v-model="loai_hop"
            :items="ten_hops"
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
          <v-container class="grey lighten-3" v-if="item.loi_nhuan.length>0">
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
              v-for="k in item.loi_nhuan"
              :key="k"
            >
              <v-col
                v-for="n in k"
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
    <div v-if="loai_hop">
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
          <v-col v-if="editedIndex===-1" cols="12" sm="2">
          <v-select
            v-model="so_lop"
            :items="solops"
            label="Số Lớp"
          ></v-select>
        </v-col>
          <v-spacer></v-spacer>
          <span>
            <v-btn v-if="editedIndex!==-1" class="ma-2" outlined color="indigo" dark @click="exportFunc">Export</v-btn>
            <v-btn class="ma-2" outlined color="indigo" dark @click="importFunc">Import</v-btn>
          </span>
        </v-card-title>

        <v-card-text>
          <v-container v-if="editedItem.loi_nhuan.length>0">
            <v-row>
              <v-col cols="12" sm="12">
                <v-container class="grey lighten-2">
                  <v-row
                    v-for="k in editedItem.loi_nhuan"
                    :key="k"
                  >
                    <v-col
                      v-for="n in k"
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
      loai_hop: '',
      ten_hops:[],
      editedIndex: -1,
      editedItem: {
        loai_hop: '',
        cong_thuc: '',
        loi_nhuan: []
      },
      defaultItem: {
        loai_hop: '',
        cong_thuc: '',
        loi_nhuan: []
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Add ' + this.loai_hop : 'Edit ' + this.loai_hop
      },
    },

    async asyncData({ $axios }) {
      const hops = await $axios.$get('/api/hop')
      let item = []
      let ten_hop = []
      var ele
      for (ele of hops) {
        item.push(ele)
        ten_hop.push(ele.loai_hop)
      }
      return {items: item, ten_hops: ten_hop};
    },

    methods: {
      addItem() {
        if (this.loai_hop === '') return;
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
        console.log(this.so_lop + " : " + this.loai_hop);
      },

      importFunc(){
        this.dialog_import = true;
        console.log("importFunc")
        console.log(this.so_lop + " : " + this.loai_hop);
      },

      async upload ({ $axios }) {
        console.log("Upload")
        console.log(this.so_lop + " : " + this.loai_hop);
        this.loading = true;
        let formData = new FormData();
        for (let file of this.files) {
          console.log(file.name)
          var reader = new FileReader();
          reader.onloadend = function (e) {
            const dataURL = reader.result;
            formData.data = dataURL;
            // console.log(JSON.stringify(formData));
          }

          if (file) {
            reader.readAsDataURL(file)
          }

          function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }

          while(reader.readyState != 2) {
            console.log("state" + reader.readyState)
            await sleep(1);
          }

          await this.$axios.post('/api/upload',
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
            this.editedItem.loi_nhuan = res.data
          })
          .catch(function(){
            console.log('FAILURE!!');
          });
          setTimeout(this.close(), 3000)
        }
      },

      close () {
        console.log("Close");
        this.dialog_import = false;
        // this.loading = false;
        // this.dialog = false;
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