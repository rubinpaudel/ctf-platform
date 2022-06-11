<template>
    <div class="container-fluid h-100 d-flex flex-column align-items-center justify-content-center pt-5">
        <h1 v-if="newChallenge.Name == '' || newChallenge.Name == undefined"> Quiz Challenge </h1>
        <h1 v-else> {{newChallenge.Name}} </h1>
        <section class="w-50" v-if="currentStep==1">

            <div class="mb-3">
                <label for="cn" class="form-label">Name</label>
                <input type="text" class="form-control" id="cn" placeholder="Challenge Name" v-model="newChallenge.Name" required>
            </div>

            <div class="mb-3">
                <label for="cc" class="form-label">Category</label>

                <select v-model="newChallenge.ChallengeCategoryID" class="form-select" required id="cc">
                    <option v-for="category in Categories" :value="category.Id" :key="category.Id">
                        {{ category.Name }}
                    </option>
                </select>

            </div>

            <div class="mb-3">
                <label for="cr" class="form-label">Round</label>
                <select v-model="newChallenge.RoundID" class="form-select" required id="cr">
                    <option v-for="round in Rounds" :value="round.Id" :key="round.Id">
                        {{ round.Name }}
                    </option>
                </select>

            </div>

            <div class="mb-3">
                <label for="crc" class="form-label">Required Challenge</label>

                <select v-model="newChallenge.RequiredChallengeID" class="form-select" id="crc" multiple>
                    <option v-for="challenge in Challenges" :value="challenge.Id" :key="challenge.Id" :selected="newChallenge.RequiredChallengeID?.includes(challenge.Id)">
                        {{ challenge.Name }}
                    </option>
                </select>

            </div>
            
            <div class="mb-3">
                <label for="cd" class="form-label">Description </label>
                <textarea  class="form-control" id="cd" rows="3" v-model="newChallenge.Description" required></textarea>
            </div>

        </section>

        <section class="w-50" v-else-if="currentStep == 2">


            
            <div class="mb-3">
                <label for="cf" class="form-label">Flag</label>
                <input type="text" class="form-control" id="cf" placeholder="UHCTF{SOME_FLAG}" v-model="newChallenge.Flags[0]" required>
            </div>

            <div class="mb-3">
                <label for="cp" class="form-label">Points</label>
                <input type="Number" class="form-control" id="cp" placeholder="15" min="0" v-model="newChallenge.Points" required>
            </div>
        

        </section>





        <div class="w-50 py-3 h-100" v-else-if="currentStep == 3">

            <div 
                class="container-fluid p-0 bg-dark text-white shadow shadow-lg py-4 px-2 d-flex flex-row text-dark h-100 rounded my-4"
                v-for="(quiz, index) in QuizQuestions"
                :key="index"
            >
        
                <div class="d-flex flex-column px-2 mt-3">

                    <BIconArrowUp class="pointer mb-2" @click="onMoveUp(index)"></BIconArrowUp>
                    <BIconArrowDown class="pointer" @click="onMoveDown(index)"></BIconArrowDown>

                </div>

                <div class="container-fluid">

                    <div class="d-flex flex-row justify-content-between">
                        <h3 class="fw-bolder fs-6">Question {{index}} : {{quiz.Question}}</h3>    
                        <div class="form-check form-switch">
                            <span for="MultipleChoice" class="form-check-label">Multiple Choice</span>
                            <input class="form-check-input" type="checkbox" id="MultipleChoice" v-model="quiz.isMultipleChoice" @change="onMultipleChoiceChange(index)">
                        </div>
                    </div>

                    <div class="my-3">
                        <input type="text" class="form-control" v-model="quiz.Question" required>
                    </div>

                    <span class="fw-bolder fs-6">Answer</span>

                    <div class="my-3" v-if="!quiz.isMultipleChoice">
                        <input type="text" class="form-control" v-model="quiz.Answer" required>
                    </div>

                    <div class="container-fluid pb-2" v-if="quiz.isMultipleChoice">

                        <div class="my-3 d-flex flex-row align-items-center" v-for="(answer, aindex) in quiz.Answer" :key="aindex">
                            
                            <span class="text-muted fw-bolder fs-6 px-3"> {{getAlphabetAtIndex(aindex)}}</span>
                            <input type="text" class="form-control" v-model="answer.Answer" required>

                            <BIconCheckSquare v-if="!answer.IsCorrect" @click="onAnswerIsCorrectChange(index,aindex)" class="fs-2 pointer ms-2"></BIconCheckSquare>
                            <BIconCheckSquareFill v-else @click="onAnswerIsCorrectChange(index,aindex)" class="fs-2 pointer success ms-2"></BIconCheckSquareFill>

                            <BIconTrash class="text-danger mx-2 pointer fs-2" @click="onRemoveAnswer(index, aindex)"></BIconTrash>
                        </div>

                        <p class="pointer text-end p-0 m-0 fw-bolder fs-small" @click="onAddAnswer(index)">Click here to add an answer</p>

                    </div>

                    <p class="text-danger pointer text-end p-0 m-0 fs-small" @click="onDeleteQuestion(index)">Delete Question</p>

                </div>
                
            </div>
            <p class="pointer text-end p-0 m-0 text-underline" @click="onAddQuestion">Click here to add a question</p>
        </div>

        <ButtonComponent :onClick="onNextStep" v-if="currentStep != maxSteps" class="my-1">Next</ButtonComponent>
        <ButtonComponent :onClick="onPreviousStep" v-if="currentStep != 1" class="my-1">Previous</ButtonComponent>
        <ButtonComponent :onClick="onCreateChallenge" v-if="currentStep == maxSteps" class="mt-1 mb-3">
            {{ isEditChallenge? 'Edit Challenge' : 'Create Challenge' }}
        </ButtonComponent>


    </div>
</template>

<script lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import { ChallengeService } from '../../../services/ChallengeService';
import { RoundService } from '../../../services/RoundService';
import {Challenge, Quiz, QuizMultipleChoiceAnswer} from '../../../types/'
import { BIconArrowUp, BIconArrowDown, BIconTrash, BIconCheckSquareFill, BIconCheckSquare } from 'bootstrap-icons-vue'
import { useStore } from 'vuex';
import { State } from '@/store';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent ({
    components : { ButtonComponent, BIconArrowDown, BIconArrowUp, BIconTrash, BIconCheckSquareFill, BIconCheckSquare},
    setup () {
        const router = useRouter();
        const route = useRoute();
        const toast = useToast();
        const store = useStore<State>();

        const maxSteps = 3;
        const currentStep = ref<number>(1);

        const Categories = ref<any[]>([]);
        const Rounds = ref<any[]>([])
        const Challenges = ref<any[]>([]);

        const QuizQuestions = reactive<Quiz[]>([]);
        
        const newChallenge = ref<Challenge["Challenge"]>({Flags: [''], Name: '', RoundID: 0, ChallengeCategoryID: 0, Description: "", Points: 0, RequiredChallengeID: []});

        const isEditChallenge = ref<boolean>(false);

        onBeforeMount(async () => {
            if (route.params.id && route.params.id != "") {
                // We need to edit the Quiz Challenge
                isEditChallenge.value = true;

                // Get The Challenge Info
                try {
                    
                    const data = (await ChallengeService.getChallengeById(parseInt(route.params.id as string))).data.challenge;
                    // Get The Flags
                    newChallenge.value = {
                            Name: data.Name, 
                            Description: data.Description, 
                            RoundID: data.Round.Id, 
                            ChallengeCategoryID: data.ChallengeCategory.Id,
                            Points : data.Points,
                            Flags: (await ChallengeService.getFlags(parseInt(route.params.id as string))).data.Flags,
                            RequiredChallengeID: []
                        }
                    data.RequiredChallenges.forEach((c : any) => newChallenge.value.RequiredChallengeID?.push(c.Id))
                    console.log(data);
                    // Parse The Quiz
                    data.Quiz.forEach((q : Quiz) => { QuizQuestions.push(q)});

                } catch (error : any) {
                    toast.error(error.response.data.errorMessage);
                }

            }


            Categories.value = (await ChallengeService.getChallengeCategory()).data.ChallengeCategories;
            Challenges.value = (await ChallengeService.listChallenges()).data.Challenges;
            Rounds.value = (await RoundService.getRounds()).data.Rounds
        })
        
        const onNextStep = () => currentStep.value = (currentStep.value + 1) % (maxSteps+1); 
        const onPreviousStep = () => {
            if (currentStep.value == 0) return
            currentStep.value = currentStep.value - 1; 
        }

        const onAddQuestion = () => {
            const newQuestion : Quiz = {Order: QuizQuestions.length + 1, Question : '', Answer : '', isMultipleChoice: false}
            QuizQuestions.push(newQuestion);
        }
        const onCreateChallenge = async () => {
            try {
                newChallenge.value.Quiz = QuizQuestions;
                const nc : Challenge = {ChallengeType : "Quiz", Challenge: newChallenge.value};
                let response;
                if (!isEditChallenge.value) {
                    response = await ChallengeService.createChallenge(nc, null);
                } else {
                    response = await ChallengeService.editChallenge(nc, parseInt(route.params.id as string));
                }
                toast.success(response.data.message);
                router.push("/admin/round-config");
                (store.state.SocketIOService?.getSocket)?.emit('new-round');

            } catch (error : any) {
                toast.error(error.response.data.errorMessage);
            }
        }

        const onAddAnswer = (questionIndex : number) => (QuizQuestions[questionIndex].Answer as QuizMultipleChoiceAnswer[]).push({Answer : '', IsCorrect: false});

        const onMultipleChoiceChange = (questionIndex : number) => {
            if (QuizQuestions[questionIndex].isMultipleChoice) {
                QuizQuestions[questionIndex].Answer = [];
                onAddAnswer(questionIndex);
            }
            else QuizQuestions[questionIndex].Answer = '';
        }
        
        const onMoveUp = (questionIndex : number) => {
            if (questionIndex == 0) return
            [QuizQuestions[questionIndex - 1], QuizQuestions[questionIndex]] =  [QuizQuestions[questionIndex], QuizQuestions[questionIndex - 1]];
        }

        const onMoveDown = (questionIndex : number) => {
            if (questionIndex == (QuizQuestions.length - 1)) return
            [QuizQuestions[questionIndex + 1], QuizQuestions[questionIndex]] =  [QuizQuestions[questionIndex], QuizQuestions[questionIndex + 1]];

        }

        const onAnswerIsCorrectChange = (questionIndex : number, answerIndex : number) => (QuizQuestions[questionIndex].Answer as QuizMultipleChoiceAnswer[])[answerIndex].IsCorrect = !(QuizQuestions[questionIndex].Answer as QuizMultipleChoiceAnswer[])[answerIndex].IsCorrect;

        const onDeleteQuestion = (index : number) => {
            QuizQuestions.splice(index, 1);
            QuizQuestions.forEach((item : Quiz, index : number) => item.Order = index);
        }


        const onRemoveAnswer = (questionIndex : number, answerIndex : number) => (QuizQuestions[questionIndex].Answer as QuizMultipleChoiceAnswer[]).splice(answerIndex, 1);

        const getAlphabetAtIndex = (index : number) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')[Math.abs(index % 26)]

        return {
            currentStep,
            maxSteps,
            Categories,
            Rounds,
            Challenges,
            newChallenge,
            QuizQuestions,
            isEditChallenge,
            onNextStep,
            onPreviousStep,
            onCreateChallenge,
            onAddQuestion,
            onDeleteQuestion,
            getAlphabetAtIndex,
            onAddAnswer,
            onMoveUp,
            onMoveDown,
            onMultipleChoiceChange,
            onRemoveAnswer,
            onAnswerIsCorrectChange,
        }
    }

})
</script>

<style scoped lang="scss">

.pointer { cursor : pointer }

.bg-grey {
    background-color: #F1F3F6;
}

.success {
    color: #6EF358;
}
.fs-small {
    font-size: .75em;
}
</style>