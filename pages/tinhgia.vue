<template>
  <v-container>
    <h2 class="text-center" style="color:#1E88E5;">Tool Tính Giá Ebox</h2>
    <br/>
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            prepend-icon="mdi-cart-plus"
            v-model="loaihop"
            :items="listloaihop"
            label="Loại Hộp"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            prepend-icon="mdi-call-merge"
            v-model="loaigiay"
            :items="listloaigiay"
            label="Loại Giấy"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            prepend-icon="mdi-table-row-height"
            v-model="chieudai"
            label="Chiều Dài (cm)"
            placeholder="cm"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            prepend-icon="mdi-table-row-height"
            v-model="chieurong"
            label="Chiều Rộng (cm)"
            placeholder="cm"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            prepend-icon="mdi-table-row-height"
            v-model="chieucao"
            label="Chiều Cao (cm)"
            placeholder="cm"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            prepend-icon="mdi-plus-circle-outline"
            v-model="soluong"
            label="Số Lượng"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-checkbox
            v-model="isprint"
            label="In"
          ></v-checkbox>
        </v-col>
        <v-col v-show="isprint" cols="12" sm="6" md="4">
          <v-select
            prepend-icon="mdi-plus-circle-outline"
            v-model="soluongmau"
            :items="listmauin"
            label="Số Lượng Màu"
          ></v-select>
        </v-col>
        <v-col v-show="isprint" cols="12" sm="6" md="4">
          <v-text-field
            prepend-icon="mdi-palette"
            v-model="mauin"
            label="Màu In"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-checkbox
            v-model="iskhuon"
            label="Khuôn"
          ></v-checkbox>
        </v-col>
        <v-col v-show="iskhuon" cols="12" sm="6" md="4">
          <v-text-field
            prepend-icon="mdi-currency-usd"
            v-model="giakhuon"
            label="Giá Khuôn vnd"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider class="primary" md="6"></v-divider>
      <v-row>
        <v-col md="6">
          <h3 style="color:#1E88E5;">Giá Bán: {{ gia }} (VND)</h3>
        </v-col>
      </v-row>
    </v-container>

  <v-spacer></v-spacer>
  <div class="center">
      <v-btn class="mx-2" outlined fab color="indigo" @click="onSubmit">OK</v-btn>
      <v-btn class="mx-2" outlined fab color="indigo" @click="onClose">Clear</v-btn>
  </div>
  <v-dialog v-model="alert" max-width="50%">
      <v-alert type="error">
        Input Invalid!
      </v-alert>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      alert: false,
      username: '',
      gia: 0,
      valid: false,

      loaihop: '',
      loaigiay: '',
      chieudai: 0,
      chieurong: 0,
      chieucao: 0,
      soluong: 0,
      mauin: '',
      soluongmau: 0,
      iskhuon: false,
      isprint: false,
      giakhuon: 500000,

      listloaihop: [],
      listloaigiay: [],

      listmauin: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
    }),
    chieudaiRules: [
      v => !!v
    ],

    async asyncData({ $axios }) {
      const hops = await $axios.$get('/api/hop')
      const giays = await $axios.$get('/api/giay')
      let loaihop = []
      let loaigiay = []
      let ele
      for (ele of hops) {
        loaihop.push(ele.loai_hop)
      }

      for (ele of giays) {
        loaigiay.push(ele.ma_giay)
      }
      console.log(giays)
      return {listloaihop: loaihop, listloaigiay: loaigiay};
    },

    methods: {
      onClose() {
        console.log("onClose function!");
        this.loaihop = '';
        this.loaigiay = '';
        this.chieudai = 0;
        this.chieurong = 0;
        this.chieucao = 0;
        this.soluong = 0;
        this.mauin = '';
        this.soluongmau = 0;
        this.khuon = false;
        this.giakhuon = 500000;
      }, 

      async onSubmit()
      {
        console.log("On Submit function!");
        if (!this.loaihop || !this.loaigiay || !this.chieudai || !this.chieurong 
            || !this.chieucao || !this.soluong) {
          this.alert = true;
          setTimeout(()=>{
                this.alert=false
          },1500)
          return
        }
        const data = {
          loaihop : this.loaihop,
          loaigiay : this.loaigiay,
          chieudai : this.chieudai,
          chieurong : this.chieurong,
          chieucao : this.chieucao,
          soluong : this.soluong,
          in : {
                isprint : this.isprint,
                mauin : this.mauin,
                soluongmau : this.soluongmau
              },
          khuon: {
            iskhuon : this.iskhuon,
            giakhuon : this.giakhuon
          }
        }
        // console.log(JSON.stringify(data))
        await this.$axios.post('/api/calculate', data)
        .then(function(res)
        {
          console.log('SUCCESS!!');
          console.log(res.data)
          this.gia = 100
        })
        .catch(function()
        {
          console.log('FAILURE!!');
        });
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