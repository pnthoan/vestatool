<template>
  <img
    class="VuetifyLogo"
    alt="Vuetify Logo"
    src="/ebox_logo.png"
  >
</template>

<style>
.VuetifyLogo {
  height: 30px;
  width: 30px;
  transform: rotateY(360deg);
  animation: turn 3.5s ease-out forwards 1s;
  animation-iteration-count: infinite;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
