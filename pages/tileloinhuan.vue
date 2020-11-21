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

    <v-list v-if="loai_hop">
      <v-list-item
        v-for="(item, index) in findElement()"
        :key="index"
      >
        <v-list-item-content v-model="item.he_so">
          <v-container class="grey lighten-3" v-if="item.he_so.length>0">
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
              v-for="(item, idx) in JSON.parse(item.he_so)"
              :key="idx"
            >
              <v-col
                v-for="(n, i) in item"
                :key="i"
              >
                <v-card
                  class="pa-2"
                  tile
                  outlined
                >
                  {{n}}
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

        <v-card-text v-model="editedItem.he_so">
          <v-container v-if="editedItem.he_so.length>0">
            <v-row>
              <v-col cols="12" sm="12">
                <v-container class="grey lighten-2">
                  <v-row
                    v-for="(k, idx) in editedItem.he_so"
                    :key="idx"
                  >
                    <v-col
                      v-for="(n,i) in k"
                      :key="i"
                    >
                      <v-card
                        class="pa-2"
                        tile
                        outlined
                      >
                        {{n}}
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
          <v-btn color="blue darken-1" text @click="cancelFunc">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveFunc">Save</v-btn>
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
            @click="closeImportFunc"
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

    <v-dialog v-model="alert" max-width="50%">
      <v-alert type="error">
        Something wrong!
      </v-alert>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data: () => ({
      alert: false,
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
        so_lop: 0,
        he_so: []
      },
      defaultItem: {
        so_lop: 0,
        he_so: []
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Add ' + this.loai_hop : 'Edit ' + this.loai_hop
      }
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
      findElement() {
        console.log("findElement")
        var ele
        for (ele of this.items) {
          if (ele.loai_hop === this.loai_hop) {
            console.log(ele)
            return ele.loi_nhuan
          }
        }
        return {he_so : []}
      },

      addItem() {
        if (this.loai_hop === '') return;
        this.editedIndex = -1;
        this.dialog = true;
      },

      editItem (item) {
        console.log(JSON.stringify(item))
        this.so_lop = item.so_lop
        this.editedItem.he_so = []
        this.editedItem.so_lop = item.so_lop
        let el;
        for (el of JSON.parse(item.he_so)) {
          this.editedItem.he_so.push(el)
        }

        console.log(JSON.stringify(this.editedItem.he_so));
        // this.editedIndex = this.items.indexOf(item)
        this.editedIndex = 2
        // console.log(this.editedIndex)
        // this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        console.log(JSON.stringify(item))
        console.log(this.loai_hop)
        // this.editedIndex = this.items.indexOf(item)
        // this.editedItem = Object.assign({}, item)
        this.so_lop = item.so_lop
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        // this.items.splice(this.editedIndex, 1)
        const index = this.getMatchItem(this.loai_hop);
        if (index < 0)
        {
          console.log("Not found item!");
        }
        else
        {
          console.log("Found!");
          var ln = this.items[index].loi_nhuan
          let sl_idx
          var so_lop_cv = 0
          if (this.so_lop !== "All") {
            so_lop_cv = parseInt(this.so_lop)
          }
          console.log("pnthoan: " + so_lop_cv + ":" + this.so_lop)
          for (sl_idx in ln){
            if (parseInt(ln[sl_idx].so_lop) === so_lop_cv) {
              console.log('Found thong tin so_lop = ' + ln[sl_idx].so_lop);
              ln.splice(sl_idx, 1)
            }
          }
          const data = {loi_nhuan: ln}

          await this.$axios.put('/api/hop/' + this.items[index]._id, data)
          .then(function(res)
          {
            console.log('SUCCESS!!');
            // console.log(res.data)
          })
          .catch(function()
          {
            console.log('FAILURE!!');
          });
        }
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

      async exportFunc() {
        console.log("exportFunc")
        console.log(JSON.stringify(this.editedItem));
        const res_data = await this.$axios.post('/api/export', this.editedItem)
        .then(function(res) {
          console.log('SUCCESS!!');
          return res.data
        })
        .catch(function(){
          console.log('FAILURE!!');
        });

        console.log(res_data)
        await this.$axios({
            url: 'uploads/' + res_data,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
             var fileURL = window.URL.createObjectURL(new Blob([response.data]));
             var fileLink = document.createElement('a');

             fileLink.href = fileURL;
             fileLink.setAttribute('download', res_data);
             document.body.appendChild(fileLink);

             fileLink.click();
        });
      },

      importFunc(){
        this.dialog_import = true;
        this.dialog = false;
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

          const res_data = await this.$axios.post('/api/upload',
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
            return res.data;
          })
          .catch(function(){
            console.log('FAILURE!!');
          });

          this.editedItem.he_so = []
          let el;
          for (el of res_data) {
            this.editedItem.he_so.push(el)
          }

          console.log(JSON.stringify(this.editedItem.he_so));

          // setTimeout(this.close(), 3000)
          this.loading = false;
          this.dialog_import = false;
          this.dialog = true;
        }
      },

      close () {
        console.log("Close");
        this.dialog_import = false;
        // this.loading = false;
        this.dialog = false;
      },

      cancelFunc() {
        console.log("cancelFunc");
        this.loading = false;
        this.dialog_import = false;
        this.dialog = false;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      },

      getMatchItem(hop) {
        let i
        for (i in this.items) {
          if (hop === this.items[i].loai_hop) {
            return i;
          }
        }
        return -1;
      },

      async saveFunc() {
        console.log("saveFunc");
        console.log(JSON.stringify(this.editedItem.he_so));

        const index = this.getMatchItem(this.loai_hop);

        if (index < 0)
        {
          console.log("Not found item!");
        }
        else
        {
          console.log("Found!");
          let ln = this.items[index].loi_nhuan
          let sl
          let so_lop_cv = 0
          let found = false

          if (this.so_lop !== "All") {
            so_lop_cv = parseInt(this.so_lop)
          } 
          for (sl of ln){
            if (parseInt(sl.so_lop) === so_lop_cv) {
              if (this.editedIndex === -1) { //add
                console.log('Da co thong tin so_lop = ' + this.so_lop);
                this.alert = true;
                setTimeout(()=>{
                      this.alert=false
                },1500)
                return;
              } else { //edit
                found = true;
                sl.he_so = JSON.stringify(this.editedItem.he_so)
                break;
              }
            }

          }

         const content = {
            he_so: JSON.stringify(this.editedItem.he_so),
            so_lop: so_lop_cv
          };

          if (!found) { // add new
            ln.push(content)
          }

          const data = {loi_nhuan: ln}

          await this.$axios.put('/api/hop/' + this.items[index]._id, data)
          .then(function(res)
          {
            console.log('SUCCESS!!');
            // console.log(res.data)
          })
          .catch(function()
          {
            console.log('FAILURE!!');
          });
        }

        // this.items[0].loi_nhuan = this.editedItem.he_so;
        this.dialog = false;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.files = [];
      },

      closeImportFunc() {
        console.log("closeImportFunc");
        this.dialog_import = false;
        this.files = [];
        this.dialog = true;
      }
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