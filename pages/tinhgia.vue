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
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      username: '',
      gia: 0,
      valid: false,

      loaihop: 'Hộp thường',
      loaigiay: 'Giấy 2N1X',
      chieudai: 0,
      chieurong: 0,
      chieucao: 0,
      soluong: 0,
      mauin: '',
      soluongmau: 0,
      iskhuon: false,
      isprint: false,
      giakhuon: 500000,

      listloaihop: ['Hộp thường',
                    'Hộp thường Size Lớn',
                    'Hộp giày',
                    'Hộp gài',
                    'Nắp cài 2 đáy',
                    'Nắp cài đáy gài',
                    'Âm dương gài'
                    ],
      listloaigiay: ['Giấy 2N1X',
                     'Giấy 1N2X',
                     'Giấy 2T1X',
                     'Giấy TXN',
                     'Giấy 2N3X'],

      listmauin: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
    }),
    chieudaiRules: [
      v => !!v
    ],
    methods: {
      onClose() {
        console.log("onClose function!");
        this.loaihop = 'Hộp thường';
        this.loaigiay = 'Giấy 2N1X';
        this.chieudai = 0;
        this.chieurong = 0;
        this.chieucao = 0;
        this.soluong = 0;
        this.mauin = '';
        this.soluongmau = 0;
        this.khuon = false;
        this.giakhuon = 500000;
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