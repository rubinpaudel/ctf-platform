<template>

  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid py-3">

          <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-center" id="navbarCollapse">
              <div class="navbar-nav d-flex justify-content-around" style="text-align: center">
                <div class="navbar-nav d-flex justify-content-around text-center align-items-center" style="width: 100%">
                  <router-link to='/scoreboard' class="nav-item nav-link active px-3"> SCOREBOARD </router-link>
                  <router-link to='/team/find' class="nav-item nav-link active px-3"> TEAMS </router-link>
                  <router-link to='/users' class="nav-item nav-link active px-3"> USERS </router-link>
                  <router-link to='/challenges'>CHALLENGES </router-link>
                  <img src="../../assets/bug_logo.png" class="nav-item active mx-5 align-self-center" width="50" height="50" alt="UHCTF logo">
                  <router-link to='/admin/alert' class="nav-item nav-link active px-3"> ALERT </router-link>
                  <div class="btn-group">
                      <a class="nav-item nav-link active px-3" style="cursor: pointer;" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                          CONFIG
                      </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li>
                          <router-link to='/admin/competition-config'>
                          <p class="dropdown-item">GENERAL</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to='/admin/round-config'>
                          <p class="dropdown-item">ROUNDS</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to='/admin/docker'>
                          <p class="dropdown-item">DOCKER</p>
                          </router-link>
                        </li>
                        <li>
                          <router-link to='/admin/create-admin'>
                          <p class="dropdown-item">CREATE ADMIN</p>
                          </router-link>
                        </li>
                    </ul>
                  </div>
                  <router-link to='/team/overview' v-if="hasTeam" class="nav-item nav-link active px-3">MY TEAM</router-link>
                  <router-link to='/team/create' v-if="!hasTeam" class="nav-item nav-link active px-3"> CREATE TEAM </router-link>
                  <a to='#' class="nav-item nav-link active px-3 pointer" :onClick="onLogoutClick">LOGOUT</a> 
                </div>
              </div>
          </div>
      </div>
  </nav>

</template>

<script lang="ts">
import { State } from '@/store';
import { defineComponent ,onBeforeMount, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { UserService } from '@/services/UserService';

export default defineComponent ({
    setup () {
        const hasTeam = ref();
        const router = useRouter();
        const store = useStore<State>();

        const onLogoutClick = () => {
            store.dispatch('LogOut')
            .then(() => router.push('/login'))
        }
        onBeforeMount(async () => {
            hasTeam.value = (await UserService.hasTeam()).data.hasTeam;
            store.dispatch("HasTeam", hasTeam.value);
        })

        watch(() => store.state.hasTeam, (newVal) => {
            hasTeam.value = newVal;
        })
        return {onLogoutClick,hasTeam}
    }
})
</script>

<style lang="scss" scoped>
p:hover{
  text-decoration: underline; 
  color: white;
}

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

.dropdown-menu {
    text-align: center;
}

a:active {
  text-decoration: underline;
}
</style>