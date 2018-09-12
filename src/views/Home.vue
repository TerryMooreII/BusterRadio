<template>
  <div>
    
   <div class="flex  pb-24 h-screen">
    <Sidenav /> 
    <!-- Router Goes here -->
    
    <div class="flex-grow px-24 py-2 overflow-scroll">
      <h2 class="antialiased text-grey-darkest py-6">Lastest Uploaded Shows</h2>
      <div class="flex items-stretch flex-wrap justify-center">
        <show v-for="show of shows" :key="show.identifier" :show="show"/>
      </div>
    </div>
  </div>
  <Footer />
</div>
  
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidenav from '@/components/Sidenav.vue'
import Footer from '@/components/Footer.vue'
import Show from '@/components/Show.vue'
import axios from 'axios-jsonp-pro';

export default {
  name: 'home',
  components: {
    Navbar,
    Sidenav,
    Show,
    Footer
  },
  data() {
    return {
      shows: []
    }
  },
  beforeCreate() {
    if(!localStorage.artists){
      axios.jsonp('https://archive.org/advancedsearch.php?q=mediatype%3Acollection+AND+collection%3Aetree&fl[]=identifier&fl[]=title&sort[]=titleSorter+asc&sort[]=&sort[]=&rows=10000&page=1&callback=__ng_jsonp__.__req0.finished&save=yes&output=json')
        .then(response => localStorage.setItem('artists', JSON.stringify(response.response.docs)));
    }
    
    
    axios.jsonp('https://www.archive.org/advancedsearch.php?q=collection%3Aetree&fl%5B%5D=avg_rating&fl%5B%5D=call_number&fl%5B%5D=collection&fl%5B%5D=contributor&fl%5B%5D=coverage&fl%5B%5D=creator&fl%5B%5D=date&fl%5B%5D=description&fl%5B%5D=downloads&fl%5B%5D=foldoutcount&fl%5B%5D=format&fl%5B%5D=headerImage&fl%5B%5D=identifier&fl%5B%5D=imagecount&fl%5B%5D=language&fl%5B%5D=licenseurl&fl%5B%5D=mediatype&fl%5B%5D=month&fl%5B%5D=num_reviews&fl%5B%5D=oai_updatedate&fl%5B%5D=publicdate&fl%5B%5D=publisher&fl%5B%5D=rights&fl%5B%5D=scanningcentre&fl%5B%5D=source&fl%5B%5D=subject&fl%5B%5D=title&fl%5B%5D=type&fl%5B%5D=volume&fl%5B%5D=week&fl%5B%5D=year&sort%5B%5D=publicdate+desc&sort%5B%5D=&sort%5B%5D=&rows=32&page=1&output=json&callback=__ng_jsonp__.__req2.finished&save=yes')
      .then(response => {
        this.shows = response.response.docs;
        console.log(this.shows);
      });
  }
};
</script>

<style>
  
</style>
