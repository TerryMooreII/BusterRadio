<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
  @media (min-width: 1400px) {
    // body{
    //   //font-family: 'Encode Sans Expanded', sans-serif !important;

    //   // font-family: 'Roboto', sans-serif !important;
    // }
    .sxl\:mx-64 {
      margin-left: 16em;
      margin-right: 16em;
    }
  }

  .bg-white-show {
    background-color: snow;
  }

  .h-0 {
    height: 0;
  }
  body {
    background-color: #F5F5F5;
    overflow: auto;
  }

  .bg-f5 {
    background-color: #F5F5F5
  }

  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
