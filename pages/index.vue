<template>
  <v-container>
    <h2 class="text-center" style="color:#1E88E5;">Welcome!</h2>
    <br/>
  </v-container>
</template>

<script>
  export default {
    layout: 'login',
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