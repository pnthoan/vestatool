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
            <input id="fileElem" class="ma-2 form-control" type="file" :accept="SheetJSFT" @change="_change" style="display:none"/>
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

    <v-dialog v-model="alert" max-width="50%">
      <v-alert type="error">
        Something wrong!
      </v-alert>
    </v-dialog>
  </div>
</template>

<script>
const make_cols = refstr => Array(XLSX.utils.decode_range(refstr).e.c + 1).fill(0).map((x,i) => ({name:XLSX.utils.encode_col(i), key:i}));
const _SheetJSFT = [
  "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

  export default {
    middleware: 'authenticated',
    data: () => ({
      SheetJSFT: _SheetJSFT,
      alert: false,
      dialog: false,
      loading: false,
      dialogDelete: false,
      headers: [
        { text: 'Số Lớp', value: 'so_lop', class: 'loai-hop-class'},
        { text: 'Actions', value: 'actions', class: 'actions-size', sortable: false }
      ],
      items: [],
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

    async asyncData({ $axios, $cookies}) {
      const auth = $cookies.get('auth')
      $axios.setToken(auth.token, 'Bearer')
      $axios.setHeader('Content-Type', 'application/json')
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
        var ele
        for (ele of this.items) {
          if (ele.loai_hop === this.loai_hop) {
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

        this.editedIndex = 2
        this.dialog = true
      },

      deleteItem (item) {
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
          // If so_lop is ALL --> convert to 0
          if (this.so_lop !== "All") {
            so_lop_cv = parseInt(this.so_lop)
          }

          // Create new array to save other element except deleted one.
          var lnhuan = []
          for (sl_idx in ln){
            if (parseInt(ln[sl_idx].so_lop) === so_lop_cv) {
              continue
            }
            lnhuan.push(ln[sl_idx])
          }
          const data = {loi_nhuan: lnhuan}

          // Query to server to update database
          await this.$axios.put('/api/hop/' + this.items[index]._id, data)
          .then(function(res)
          {
            // Update local data
            for (sl_idx in ln){
              if (parseInt(ln[sl_idx].so_lop) === so_lop_cv) {
                ln.splice(sl_idx, 1)
              }
            }
            return;
          })
          .catch(function()
          {
            this.alert = true;
            setTimeout(()=>{
                  this.alert=false
            },1500)
            return;
          });
        }
        this.closeDelete()
      },

      closeDelete () {
        this.dialogDelete = false
        console.log("closeDeleteFunc")
      },

      save () {
        console.log("save function")
      },

      async exportFunc() {
        console.log("exportFunc")
        const ws = XLSX.utils.aoa_to_sheet(this.editedItem.he_so);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        /* generate file and send to client */
        XLSX.writeFile(wb, "export_data.xlsx");
      },

      importFunc(){
        console.log("importFunc")
        if (process.client) {
          document.getElementById("fileElem").click()
        }
      },

      _change(evt) {
        const file = evt.target.files;
        if(file && file[0]) this._file(file[0]);
        evt.target.value = '';
      },

      _file(file) {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, {type:'binary'});
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, {header:1});
          /* Update state */
          this.editedItem.he_so = data
        };
        reader.readAsBinaryString(file);
      },

      cancelFunc() {
        console.log("cancelFunc");
        this.loading = false;
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

        const index = this.getMatchItem(this.loai_hop);
        if (index < 0)
        {
          console.log("Not found item!");
          this.alert = true;
          setTimeout(()=>{
                this.alert=false
          },1500)
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

          // Clone
          let lnhuan = []
          for (sl of ln) {
            lnhuan.push(sl)
          }

          for (sl of lnhuan){
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
            lnhuan.push(content)
          }

          const data = {loi_nhuan: lnhuan}

          await this.$axios.put('/api/hop/' + this.items[index]._id, data)
          .then(function(res)
          {
            console.log('SUCCESS!!');
            if (found) {
              sl.he_so = JSON.stringify(this.editedItem.he_so)
            } else {
              ln.push(content)
            }
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