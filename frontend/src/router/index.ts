import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import multiguard from 'vue-router-multiguard';
// Routing Views

import TeamNotFound from '@/views/Team/TeamNotFound.vue'
import CompetitionConfig from '@/views/Admin/CompetitionConfiguration.vue'
import TeamConfig from '@/views/Admin/TeamConfiguration.vue'
import ChallengeConfiguration from '@/views/Admin/ChallengeConfiguration.vue'
import SendAlert from '@/views/Admin/SendAlert.vue'
import ChallengeOverview from '@/views/Competition/ChallengeOverview.vue'
import ScoreBoard from '@/views/Competition/ScoreBoard.vue'
import MyTeam from '@/views/Team/MyTeam.vue'
import CreateTeam from '@/views/Team/CreateTeam.vue'
import FindTeam from '@/views/Team/FindTeam.vue'
import DockerConfiguration from '@/views/Admin/DockerConfiguration.vue'
import RoundConfiguration from '@/views/Admin/RoundConfiguration.vue'
import PointsConfiguration from '@/views/Admin/PointsConfiguration.vue'
import SolvesConfiguration from '@/views/Admin/SolvesConfiguration.vue'
import PurchasesConfiguration from '@/views/Admin/PurchasesConfiguration.vue'
import UserLogin from '@/views/User/UserLogin.vue'
import UserRegister from '@/views/User/UserRegister.vue'
import UserProfile from '@/views/User/UserProfile.vue'
import HomePage from '@/views/Miscellaneous/HomePage.vue'
import PageNotFound from '@/views/Miscellaneous/PageNotFound.vue'
import PassThroughView from '@/views/Miscellaneous/PassThroughView.vue'
import CreateChallenge from '@/views/Admin/CreateChallenge.vue'
import NormalChallenge from '@/views/Admin/CreateChallenge/NormalChallenge.vue'
import QuizChallenge from '@/views/Admin/CreateChallenge/QuizChallenge.vue'
import DockerizedChallenge from '@/views/Admin/CreateChallenge/DockerizedChallenge.vue'
import CompetitionNotStarted from '@/views/Miscellaneous/CompetitionNotStarted.vue';
import FindUsers from '@/views/User/FindUsers.vue'
import CreateAdmin from '@/views/Admin/CreateAdmin.vue';
import { authGuard, adminGuard, teamGuard, competitionGuard } from './guards'
import ResetPassword from '@/views/User/ResetPassword.vue'; 

const routes: Array<RouteRecordRaw> = [

  /* Team Routes */
  {
    path: '/team',
    children : [
      {
        path: 'overview',
        name: 'team-overview',
        beforeEnter: teamGuard,
        component : MyTeam,
      },
      {
        path: 'create',
        name: 'create-team',
        beforeEnter: teamGuard,
        component : CreateTeam,
      },
      {
        path: 'find',
        name: 'find-team',
        beforeEnter: teamGuard,
        component : FindTeam,
      },
      {
        path: ':pathMatch(.*)*',
        name: 'team404',
        component : TeamNotFound
      },
    ],
    beforeEnter: authGuard,
    component : PassThroughView
  },
  /* Admin Routes */

  {
    path : '/admin',
    children : [
      {
        path: 'competition-config',
        name: 'competition-config',
        component : CompetitionConfig
      },
      {
        path: 'team-config',
        name: 'team-config',
        component : TeamConfig
      },
      {
        path: 'challenge-config',
        name: 'challenge-config',
        component : ChallengeConfiguration,
      },
      {
        path: 'round-config',
        name: 'round-config',
        component : RoundConfiguration,
      },
      {
        path: 'points-config',
        name: 'points-config',
        component : PointsConfiguration,
      },
      {
        path: 'solves-config',
        name: 'solves-config',
        component : SolvesConfiguration,
      },
      {
        path: 'purchases-config',
        name: 'purchases-config',
        component : PurchasesConfiguration,
      },
      {
        path: 'docker',
        name: 'docker-config',
        component : DockerConfiguration,
      },
      {
        path: 'alert',
        name: 'alert',
        component : SendAlert,
      },
      {
        path: 'create-challenge',
        name: 'create-challenge',
        component : CreateChallenge,
      },
      {
        path: 'create-admin',
        name: 'create-admin',
        component : CreateAdmin,
      },
      {
        path: 'create-normal-challenge/:id?',
        name: 'create-normal-challenge',
        component : NormalChallenge,
      },
      {
        path: 'create-quiz-challenge/:id?',
        name: 'create-quiz-challenge',
        component : QuizChallenge,
      },
      {
        path: 'create-dockerized-challenge/:id?',
        name: 'create-dockerized-challenge',
        component : DockerizedChallenge,
      },
    ],
    beforeEnter: adminGuard,
    component: PassThroughView
  },


  {
    path: '/challenges',
    name: 'challenges',
    beforeEnter: multiguard([authGuard, competitionGuard]),
    component : ChallengeOverview,
  },
  {
    path: '/scoreboard',
    name: 'scoreboard',
    beforeEnter: authGuard,
    component : ScoreBoard,
  },
  {
    path: '/login',
    name: 'login',
    beforeEnter: authGuard,
    component : UserLogin,
  },
  {
    path: '/reset-password/:code?',
    name: 'reset-password',
    component : ResetPassword,
  },
  {
    path: '/register',
    name: 'register',
    component : UserRegister,
  },
  {
    path: '/profile',
    name: 'profile',
    component : UserProfile,
  },
  {
    path: '/users',
    name: 'users',
    component : FindUsers,
  },
  {
    path: '/',
    name: 'homepage',
    component : HomePage,
  },
  {
    path : '/competition-404',
    name : 'competition-404',
    component: CompetitionNotStarted
  },
  {
    path : '/:pathMatch(.*)*',
    name: '404',
    component: PageNotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
