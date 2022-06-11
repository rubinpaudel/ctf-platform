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
                  <router-link to='/team/find' class="nav-item nav-link active px-3"> 
                    TEAMS
                  </router-link>
                  <router-link to='/users' class="nav-item nav-link active px-3"> 
                    USERS
                  </router-link>
                  <router-link to='/challenges' class="nav-item nav-link active px-3">
                    CHALLENGES
                  </router-link>
                  <img src="../../assets/bug_logo.png" class="nav-item active mx-5  align-self-center" width="50" height="50" alt="UHCTF logo">
                  <router-link to='/profile' class="nav-item nav-link active px-3">
                    PROFILE
                  </router-link>
                  <router-link to='/team/overview' v-if="hasTeam" class="nav-item nav-link active px-3">
                    MY TEAM 
                  </router-link>
                  <router-link to='/team/create' v-if="!hasTeam" class="nav-item nav-link active px-3">
                    CREATE TEAM
                  </router-link>
                  <router-link to='/login' :onClick="onLogoutClick" class="nav-item nav-link active px-3"> 
                    LOGOUT
                  </router-link>
              </div>
          </div>
      </div>
  </nav>

</template>

<script lang="ts">
import { State } from '@/store';
import { defineComponent , onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { UserService } from '@/services/UserService';

export default defineComponent ({
  setup () {
    const hasTeam = ref();
    const router = useRouter();
    const store = useStore<State>();

    onBeforeMount(async () => {
        hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
        store.dispatch("HasTeam", hasTeam.value);
    })
    const onLogoutClick = () => {
        store.dispatch('LogOut')
        .then(() => router.push('/login'))
    }

    (store.state.SocketIOService?.getSocket)?.on('kicked', async() => {
        hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
        store.dispatch("HasTeam", hasTeam.value);
        if(!hasTeam.value){
          router.push("/team/find");
        }
        
      });
      // When new teams comes in.
        (store.state.SocketIOService?.getSocket)?.on('delete-user', async() => {
            store.dispatch('LogOut')
          .then(() => router.push('/login'))
        });

    watch(() => store.state.hasTeam, (newVal) => {
      hasTeam.value = newVal;
    })
    return {onLogoutClick, hasTeam}
  }
})
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

a:active px-3 {
  text-decoration: underline;
}
</style>