<template>
    <div class="survey">
        <steps-progress class="survey__progress" :current="currentStep" :total="questions.length"/>
        <div class="survey__questions">
            <transition name="questions">
                <question :question="questions[questionIndex]" :key="questionIndex"/>
            </transition>
        </div>
        <transition name="question-actions">
            <div class="survey__actions" v-if="actionsIsAvailable">
                <button class="btn_primary btn_size-m" @click="setAnswer({title: $t('survey.action_yes'), value: 'y'})"
                        v-touch>{{$t('survey.action_yes')}}
                </button>
                <button class="btn_primary btn_size-m" @click="setAnswer({title: $t('survey.action_no'), value: 'n'})"
                        v-touch>{{$t('survey.action_no')}}
                </button>
                <br>
                <button class="btn_link btn_size-m" @click="skipQuestion" v-touch>{{$t('survey.action_skip')}}</button>
            </div>
        </transition>
        <transition name="fade-opacity">
            <promo-survey v-if="promo" @close="promo = false" class="survey__promo"/>
        </transition>
        <result-survey v-if="isCompleted && payWallIsEnabled" :offer="offer" :trialIsAvailable="trialIsAvailable" @close="gotoFeed"/>
    </div>
</template>

<script>
    import StepsProgress from './StepsProgress';
    import Question from './Question';
    import PromoSurvey from './PromoSurvey';
    import ResultSurvey from './ResultSurvey';
    import {postSurveyAnswer} from '../../api/survey';

    const ANSWER_ID_YES = 1;
    const ANSWER_ID_NOT = 2;
    const ANSWER_ID_SKIP = 3;

    export default {
        name: 'Survey',
        components: {StepsProgress, Question, PromoSurvey, ResultSurvey},
        data() {
            return {
                promo: true,
                isCompleted: false,
                isReadyToAnswer: true,
                actionsIsAvailable: true,
                questions: [],
                questionIndex: 0,
                payWallIsEnabled: true
            }
        },
        created() {
            let survey = this.$store.state.config.survey;

            this.payWallIsEnabled = survey.show_paywall;
            this.questions = survey.questions;
            this.questionIndex = Math.max(0, this.questions.findIndex(item => item.id === survey.start_with));
            this.promo = this.questionIndex === 0;
        },
        computed: {
            offer() {
                let surveyVipOffer = this.$store.state.config.survey.vip_offer;
                return surveyVipOffer.purchase || surveyVipOffer.trial;
            },
            trialIsAvailable() {
                let surveyVipOffer = this.$store.state.config.survey.vip_offer;
                return surveyVipOffer.trial != null;
            },
            currentStep() {
                return this.questionIndex + 1;
            }
        },
        methods: {
            setAnswer(answer) {
                if (!this.isReadyToAnswer) {
                    return;
                }

                let questionId = this.questions[this.questionIndex].id;
                let answerId = answer.value === 'y' ? ANSWER_ID_YES : ANSWER_ID_NOT;

                this.isReadyToAnswer = false;
                this.actionsIsAvailable = false;
                this.$set(this.questions[this.questionIndex], 'answer', answer);

                postSurveyAnswer({question_id: questionId, answer: answer.value});

                this.trackEventStepComplete(this.currentStep);
                this.trackEventMatchAnswer(questionId, answerId);

                setTimeout(() => {
                    this.nextQuestion();
                }, 800);
            },
            skipQuestion() {
                if (!this.isReadyToAnswer) {
                    return;
                }

                let questionId = this.questions[this.questionIndex].id;

                postSurveyAnswer({question_id: questionId, answer: 'skip'});

                this.trackEventStepComplete(this.currentStep);
                this.trackEventMatchAnswer(questionId, ANSWER_ID_SKIP);

                this.nextQuestion();
            },
            nextQuestion() {
                if (this.questionIndex < this.questions.length - 1) {
                    this.actionsIsAvailable = true;
                    this.isReadyToAnswer = true;
                    this.questionIndex++;
                } else {
                    if (this.payWallIsEnabled) {
                        this.isCompleted = true;
                    } else {
                        this.gotoFeed();
                    }
                }
            },
            gotoFeed() {
                this.$nav.redirect('/app/feed');
            },
            trackEventStepComplete(step) {
                this.$nativeStat.trackFirebaseEvent('match_test_step_complete', {step: step});
                this.$nativeStat.trackMetricaEvent('match_test_step_complete', {step: step});
                this.$nativeStat.trackAppsFlyerEvent('ap_match_test_step_complete', {ap_step: step});
            },
            trackEventMatchAnswer(questionId, answerId) {
                this.$nativeStat.trackFirebaseEvent('match_answer', {question_id: questionId, answer_id: answerId});
                this.$nativeStat.trackMetricaEvent('match_answer', {question_id: questionId, answer_id: answerId});
                this.$nativeStat.trackAppsFlyerEvent('ap_match_answer', {
                    ap_question_id: questionId,
                    ap_answer_id: answerId
                });
            }
        }
    }
</script>
