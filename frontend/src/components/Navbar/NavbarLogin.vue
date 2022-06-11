<template>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid py-3">

          <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-center" id="navbarCollapse">
              <div class="navbar-nav d-flex justify-content-around" style="text-align: center">
              
                  <router-link to='/scoreboard' class="nav-item nav-link active px-3"> 
                    SCOREBOARD
                  </router-link>
                
                  <img src="../../assets/bug_logo.png" class="nav-item active mx-5  align-self-center" width="50" height="50" alt="UHCTF logo">
                
                  <router-link to='/login' class="nav-item nav-link active px-3"> LOGIN </router-link>
                  <router-link to='/register' class="nav-item nav-link active px-3"> SIGN UP </router-link>
              </div>
          </div>
      </div>
  </nav>

</template>

<script lang="ts">
import { State } from '@/store';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
    setup () {
      const router = useRouter();
      const store = useStore<State>();
      const onLogoutClick = () => {

        store.dispatch('LogOut')
        .then(() => router.push('/login'))

      }
      return {onLogoutClick}
    }
});

</script>

<style lang="scss" scoped>
a{
    text-decoration: none; 
    color: white;
}


nav {
  background-color: #121212 !important;
  box-shadow: 0px 5px 4px rgba(0, 0, 0, 0.5);
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:active {
  text-decoration: underline;
}
</style>