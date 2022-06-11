<template>
  <div class="bg-light">
    <Bar
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { ChallengeService } from '@/services/ChallengeService';
import { TeamService } from '@/services/TeamService';
import { RoundService } from '@/services/RoundService';
import { Team } from '@/types/'

import { useStore } from 'vuex';
import { State } from '@/store';
import { Socket } from 'engine.io-client';
import { SocketIOService, SocketConnectionType } from '@/services/SocketIOService'

import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
ChartJS.register(annotationPlugin)

const scoreboardTypePrev = ref(null);

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    scoreboardType:{
      type: String
    },
    activeTeams:{
      type: Array
    },
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    }
  },
  data() {

    return {
      chartData: {
        labels: [ ],
        datasets: [
                    { 
                      label: "Points",
                      backgroundColor: [ ],
                      data: [ ],
                    } 
                  ]
      },
      chartOptions: {
        responsive: true,
        scales: {
          x:{
            grid : {drawBorder : true},
          },
          y:{

          }
        },

        plugins: {
          autocolors: false,
          annotation: {
            annotations: {
              box1: {
                type: 'box',
                xMin: -1,
                xMax: -1,
                yMin: 0,
                yMax: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 3,
              }
            }
          },
          title: {
            display: false,
            text: ''
          }
        },

      },
      count: 1,
      interval: {}
    }
  },
  methods: {
    async makeChart(){

      // Populate scoreboard with data

      if(this.scoreboardType == 'byTeamBoard'){
        let TeamsArray = this.activeTeams;
        let updatedTeamsArray = [];
        for(let team of TeamsArray){
          updatedTeamsArray.push((await TeamService.getTeamMembers(team.Id)).data.Team);
        }
        TeamsArray = updatedTeamsArray;

        let TeamNameArray = [];
        let TeamPointsArray = [];
        let ColorArray = [];

        let index = 1;
        let Color;
        for(let team of TeamsArray){
          TeamNameArray.push(team.Name);
          TeamPointsArray.push(team.Points);

          Color = Math.PI / 10 * index;
          while(Color > 1){
            Color -= 1;
          }

          ColorArray.push('#'+Math.floor(Color*16777215).toString(16));
          index += 1
        }

        this.chartData.labels = TeamNameArray;
        this.chartData.datasets[0].data = TeamPointsArray;
        this.chartData.datasets[0].backgroundColor = ColorArray;

      }
      else if(this.scoreboardType == 'byTeamCategoryBoard'){
        let TeamsArray = this.activeTeams;
        let updatedTeamsArray = [];
        for(let team of TeamsArray){
          updatedTeamsArray.push((await TeamService.getTeamMembers(team.Id)).data.Team);
        }
        TeamsArray = updatedTeamsArray;

        let TeamCategoriesArray = [];
        let CategoryPointsArray = [];
        let ColorArray = [];

        for(let team of TeamsArray){
          TeamCategoriesArray.push(team.Category);
        }
        let UniqueTeamCategoriesArray = [...new Set(TeamCategoriesArray)];
        let UniqueTeamAndValueArray = [];
        UniqueTeamCategoriesArray.sort();
        for(let category of UniqueTeamCategoriesArray){
          let points = 0;
          for(let team of TeamsArray){
            if(team.Category == category){
              points += team.Points;
            }
          }
          UniqueTeamAndValueArray.push([category, points]);
          points = 0;
        }

        let index = 1;
        let Color;
        for(let category of UniqueTeamCategoriesArray){
          Color = Math.PI / 10 * index;
          while(Color > 1){
            Color -= 1;
          }

          ColorArray.push('#'+Math.floor(Color*16777215).toString(16));
          index += 1
        }

        UniqueTeamAndValueArray.sort(function(a, b){
          return b[1] - a[1];
        });
        UniqueTeamCategoriesArray = [];
        for(let catValPair of UniqueTeamAndValueArray){
          UniqueTeamCategoriesArray.push(catValPair[0]);
          CategoryPointsArray.push(catValPair[1]);
        }

        this.chartData.labels = UniqueTeamCategoriesArray;
        this.chartData.datasets[0].data = CategoryPointsArray;
        this.chartData.datasets[0].backgroundColor = ColorArray;
      }
      else if(this.scoreboardType == 'byRoundBoard'){
        let TeamsArray = this.activeTeams;
        let updatedTeamsArray = [];
        for(let team of TeamsArray){
          updatedTeamsArray.push((await TeamService.getTeamMembers(team.Id)).data.Team);
        }
        TeamsArray = updatedTeamsArray;

        let TeamNameArray = [];
        let ColorArray = [];
        let MapsOfTeams = [];

        let index = 1;
        let Color;
        for(let team of TeamsArray){
          TeamNameArray.push(team.Name);
          let PointsPerRoundMap = (await TeamService.getTeamPointsPerRound(team.Id)).data.TeamPointsPerRoundMap;
          MapsOfTeams.push(PointsPerRoundMap);
        }

        this.chartData.labels = TeamNameArray;

        let roundindex = 0;
        let Rounds = (await RoundService.getRounds()).data.Rounds;
        this.chartData.datasets = [];
        
        while(this.chartData.datasets.length < Rounds.length){
          this.chartData.datasets.push(
            { 
              label: "",
              backgroundColor: [ ],
              data: [ ],
            } 
          )
        }

        for(let Round of Rounds){

          // Specific to rounds

          this.chartData.datasets[roundindex].label = Round.Name;
          this.chartData.datasets[roundindex].stack = 'Stack ' + roundindex;

          Color = Math.PI / 10 * (roundindex+1);
          while(Color > 1){
            Color -= 1;
          }

          this.chartData.datasets[roundindex].backgroundColor = '#'+Math.floor(Color*16777215).toString(16);

          // Specific to teams

          let ValueArray = [];
          for(let MapOfTeam of MapsOfTeams){
            if(MapOfTeam[0].length > 0 && MapOfTeam[1].length > 0){
                if(MapOfTeam[0].includes(Round.Id)){
                  let mapindex = MapOfTeam[0].indexOf(Round.Id);
                  ValueArray.push(MapOfTeam[1][mapindex]);
                }
                else{
                  ValueArray.push(0);
                }
            }
          }
          this.chartData.datasets[roundindex].data = ValueArray;

          roundindex += 1;
        }

      }
      else if(this.scoreboardType == 'byCategoryBoard'){
        let TeamsArray = this.activeTeams;
        let updatedTeamsArray = [];
        for(let team of TeamsArray){
          updatedTeamsArray.push((await TeamService.getTeamMembers(team.Id)).data.Team);
        }
        TeamsArray = updatedTeamsArray;

        // First get all challenge categories
        let ChallengeCategoryArray = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
        let ChallengeCategoryNameArray = [];
        for(let ChallengeCategory of ChallengeCategoryArray){
          ChallengeCategoryNameArray.push(ChallengeCategory.Name);
        }
        let ChallengePointsArray = [];
        let ColorArray = [];

        let index = 1;
        let Color;
        let SolvedChallengesDoubleArray = [];
        for(let team of TeamsArray){
          // Then get all challenges solved by the active teams
          let SolvedChallengesArray = (await TeamService.getSolvedChallenges(team.Id)).data.solvedChallenges;
          SolvedChallengesDoubleArray.push(SolvedChallengesArray);

          Color = Math.PI / 10 * index;
          while(Color > 1){
            Color -= 1;
          }

          ColorArray.push('#'+Math.floor(Color*16777215).toString(16));
          index += 1
        }

        // Add the points of the solved challenges to the correct category
        let ChallengeCatValArray = [];
        for(let ChallengeCategoryName of ChallengeCategoryNameArray){
          let points = 0;
          for(let solvedArr of SolvedChallengesDoubleArray){
            for(let solved of solvedArr){
              if(solved.Challenge.Category == ChallengeCategoryName){
                points += solved.Challenge.Points;
              }
            }
          }
          ChallengeCatValArray.push([ChallengeCategoryName, points]);
        }

        ChallengeCatValArray.sort(function(a, b){
          return b[1]-a[1];
        });
        ChallengeCategoryNameArray = [];
        for(let catValPair of ChallengeCatValArray){
          ChallengeCategoryNameArray.push(catValPair[0]);
          ChallengePointsArray.push(catValPair[1]);
        }

        this.chartData.labels = ChallengeCategoryNameArray;
        this.chartData.datasets[0].data = ChallengePointsArray;
        this.chartData.datasets[0].backgroundColor = ColorArray;

      }
      else if(this.scoreboardType == 'bySubmissionsBoard'){
        let TeamsArray = this.activeTeams;
        let updatedTeamsArray = [];
        for(let team of TeamsArray){
          updatedTeamsArray.push((await TeamService.getTeamMembers(team.Id)).data.Team);
        }
        TeamsArray = updatedTeamsArray;

        let TeamNameArray = [];
        let TeamAttemptsArray = [];
        let NameAttemptsArray = [];
        let ColorArray = [];

        let index = 1;
        let Color;
        for(let team of TeamsArray){

          NameAttemptsArray.push([team.Name, (await TeamService.getNumberOfAttempts(team.Id)).data.NumberOfAttempts]);

          Color = Math.PI / 10 * index;
          while(Color > 1){
            Color -= 1;
          }

          ColorArray.push('#'+Math.floor(Color*16777215).toString(16));
          index += 1
        }

        NameAttemptsArray.sort(function(a, b){
          return b[1] - a[1];
        });
        TeamNameArray = [];
        for(let keyValPair of NameAttemptsArray){
          TeamNameArray.push(keyValPair[0]);
          TeamAttemptsArray.push(keyValPair[1]);
        }

        this.chartData.labels = TeamNameArray;
        this.chartData.datasets[0].label = 'Submissions';
        this.chartData.datasets[0].data = TeamAttemptsArray;
        this.chartData.datasets[0].backgroundColor = ColorArray;

      }

      // Use plugin to highlight negative side of scoreboard

      this.chartOptions.plugins.annotation.annotations.box1.yMin = 0;
      for(let dataset of this.chartData.datasets){
        if(Math.min(...dataset.data) < 0)
        {
          this.chartOptions.plugins.annotation.annotations.box1.yMin = Math.min(...dataset.data);
        }
        this.chartOptions.plugins.annotation.annotations.box1.xMax = this.chartData.labels.length + 1;
      }

    }

  },
  async beforeMount(){

    scoreboardTypePrev.value = this.scoreboardType;

    this.makeChart();

    const store = useStore();
    (store.state.SocketIOService?.getSocket)?.on('refresh-chart', () => {
        console.log("Remaking chart.");
        this.makeChart();
    })

  },
  async beforeUpdate(){
    // First we have to reset everything to its default

    if(this.scoreboardType != scoreboardTypePrev.value){
      this.chartData = {
        labels : [],
        datasets: [
              { 
                label: "Points",
                backgroundColor: [ ],
                data: [ ],
              } 
            ]
      }

      this.chartOptions = {
        responsive: true,
        scales: {
          x:{

          },
          y:{

          }
        },
        plugins: {
          autocolors: false,
          annotation: {
            annotations: {
              box1: {
                type: 'box',
                xMin: -1,
                xMax: -1,
                yMin: 0,
                yMax: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 3,
              }
            }
          },
          title: {
            display: false,
            text: ''
          }
        }
      }
      scoreboardTypePrev.value = this.scoreboardType;
    }

    this.makeChart();
  }
}
</script>

<style lang="scss">

</style>