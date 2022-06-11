<template>
<div>
    <div class="modal fade pers" :id="'challengeModal'+$props.Challenge.Id" tabindex="-1" :aria-labelledby="'challengeModalLabel'+$props.Challenge.Id" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">

        <div class="modal-dialog mw-100 d-flex justify-content-center">
            <div class="modal-content bg-dark text-white w-50">

                <div class="modal-body" v-if="quizStatus == -1">

                    <!-- Title -->
                    <h2 class="text-center my-2"> {{$props.Challenge.Name}} </h2>

                    <section>
                        <h5 class="my-0"> Description </h5>
                        <hr class="my-2 text-white">

                        <p>
                           {{$props.Challenge.Description}}
                        </p>
                    </section>

                    <ButtonComponent :onClick="onStartQuiz"  class="w-100 mb-1 fw-bolder">Start Quiz</ButtonComponent>

                </div>

                <div class="modal-body pb-0" v-else-if="quizStatus == 0">
                    
                    <div class="w-100 d-flex justify-content-center flex-column" v-if="currentQuestion">

                        <h2 class="text-center my-2">{{currentQuestion.Question}}</h2>
                        <div class="w-100 mb-2" v-if="currentQuestion.isMultipleChoice">

                            <!-- Show all Answers -->
                            <div class="container-fluid d-flex justify-content-center flex-column">
                                
                                <div class="form-check" v-for="(answer, index) in currentQuestion.Answer" :key="index">
                                    <input class="form-check-input" type="checkbox" :value="answer.Answer" :id="'answer' +index" v-model="MultipleChoiceAnswers">
                                    <label class="form-check-label" :for="'answer' +index">
                                        {{answer.Answer}}
                                    </label>
                                </div>

                            </div>


                        </div>
                        <div class="w-100" v-else>
                            <label :for="'Answer' + currentQuestion.Order">Answer</label>
                            <input type="text" :id="'Answer' + currentQuestion.Order" class="form-control mb-2" placeholder="Enter your answer" v-model="Answer">
                        </div>

                        <ButtonComponent class="w-100 mb-1 fw-bolder py-2 mt-1" :onClick="onSubmitAnswer"> Next </ButtonComponent>
                    </div>
                        
                    
                </div>

                <div class="modal-body pb-0" v-else>
                    
                    <div class="w-100 d-flex justify-content-center flex-column" v-if="currentQuestion">

                        <h2 class="text-center my-2">Quiz has ended!</h2>
                        <div class="w-100 mb-2 text-center" v-if="incorrectCount == 0">
                            <BIconCheckCircle class="fs-1"></BIconCheckCircle>
                            <p>You have answered all the answers correctly you earned {{$props.Challenge.Points}} points</p>
                        </div>
                        <div class="w-100 mb-2 text-center" v-if="incorrectCount > 0">
                            <BIconXCircle class="fs-1"></BIconXCircle>
                             <p>You didn't answers all the questions correctly you can try again :(</p>
                        </div>
                        
                    </div>
                        
                    
                </div>


                <div class="px-3 pb-1">
                    <ButtonComponent type="button"  class="w-100 mb-1 fw-bolder px-1" data-bs-dismiss="modal" :onClick="onClose" v-if="quizStatus == -1 || quizStatus == 1">Close</ButtonComponent>
                </div>
               
            </div>
        </div>
    </div>
</div>
        
</template>

<script lang="ts">
import { ChallengeService } from "@/services/ChallengeService";
import { State } from "@/store";
import { BIconCheckCircle, BIconXCircle } from "bootstrap-icons-vue";
import { defineComponent, onBeforeMount, ref } from "vue";
import { useToast } from "vue-toastification";
import ButtonComponent from "./ButtonComponent.vue";
import { useStore } from 'vuex';

export default defineComponent({
    props: ["Challenge"],
    components: {ButtonComponent, BIconCheckCircle, BIconXCircle},
    setup(props, {emit}) {
        const store = useStore<State>();
        const toast = useToast();
        const quizStatus = ref<number>(-1);
        const currentQuestion = ref<any>(null);
        const incorrectCount = ref<number>(0);
        const Answer = ref<string>("");
        const MultipleChoiceAnswers = ref<string[]>([]);


        onBeforeMount(() => {
            if (props.Challenge.Quiz.length > 0)
                currentQuestion.value = props.Challenge.Quiz[0];
        })

        const getCurrentQuestion = (questionNumber : number) : any => {
            let question = null;
            props.Challenge.Quiz.forEach((q : any) => {
                if (q.Order == questionNumber) {
                    console.log('Found match')
                    question = q;
                }
            })
            return question;
        }
        
        const onClose = () => {
            incorrectCount.value = 0;
            quizStatus.value = -1;
            Answer.value = '';
            MultipleChoiceAnswers.value = [];
            if (props.Challenge.Quiz.length > 0)
                currentQuestion.value = props.Challenge.Quiz[0];
            else currentQuestion.value = 0; 
        }

        const onSubmitAnswer = async () => {
            console.log('Test');
            if (!currentQuestion.value.isMultipleChoice) {
                if (Answer.value != currentQuestion.value?.Answer) {
                    incorrectCount.value++;
                    toast.error(`Incorrect Answer!\nThe correct answer is: ${currentQuestion.value?.Answer}`);
                } else {
                    toast.success('Correct!');
                }
            } else {
                // Check if the picked items are correct
                let correct = true;
                let correctAnswers : string[] = [];
                currentQuestion.value.Answer.forEach((answer : any) => {
                    if (answer.IsCorrect && !MultipleChoiceAnswers.value.includes(answer.Answer)) correct = false;
                    if (!answer.IsCorrect && MultipleChoiceAnswers.value.includes(answer.Answer)) correct = false;
                    if (answer.IsCorrect) correctAnswers.push(answer.Answer);
                })
                
                if (!correct) {
                    incorrectCount.value++;
                    
                    toast.error(`Incorrect Answer!\n The correct answer is ${correctAnswers.join(',')}`)
                } else {
                    toast.success('Correct!');
                }


            }
            
            const newVal = getCurrentQuestion(currentQuestion.value.Order + 1);
            console.log(newVal);
            if (newVal == null && currentQuestion.value != null) {
                quizStatus.value = 1;
                // Complete the challenge
                if (incorrectCount.value == 0) {
                    try {
                        await ChallengeService.completeQuiz(props.Challenge.Id);
                        toast.success(`Completed Quiz! You earned ${props.Challenge.Points} points.`);
                        (store.state.SocketIOService?.getSocket)?.emit('send-refresh-chart', true); 
                        emit('completed', {});
                    } catch (error : any) {
                        toast.error(error.response.data.errorMessage);
                    }
                }
                
            } else {
                currentQuestion.value = newVal;
            }

        }

        const onStartQuiz = () => {quizStatus.value = 0}

        return {quizStatus, onStartQuiz, currentQuestion, incorrectCount, onSubmitAnswer, Answer, MultipleChoiceAnswers, onClose};
    }


});

</script>

<style scoped>

</style>