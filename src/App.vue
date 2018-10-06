<template>
  <div id="app">
    <router-view/>
  </div>


</template>

<style lang="less">
@media (min-width: 1400px) {
  .sxl\:px-64 { 
    padding-left: 16em;
    padding-right: 16em;
   }  
}


#heart {
    position: relative;
    width: 100px;
    height: 90px;
  }
  #heart:before,
  #heart:after {
    position: absolute;
    content: "";
    left: 50px;
    top: 0;
    width: 50px; // .625 
    height: 80px;
    background: red;
    border-radius: 50px 50px 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
  }
  #heart:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
</style>
