<template>
  <div class="game-container">
    <div class="game-stats">
      <p>Попытка: {{ currentProblemNumber }} из {{ totalProblems }}</p>
      <p>Правильно: {{ correctAnswers }}</p>
      <p>Неправильно: {{ wrongAnswers }}</p>
    </div>
    <div class="game-header">
      <button class="exit-button" @click="exitGame">Отмена</button>
      <button class="finish-button" @click="endGame">Завершить</button>
      <div class="timer">{{ formattedTime }}</div>
    </div>
    <div class="game-board">
      <div class="question">{{ currentProblem.question }}</div>
      <div class="answer">{{ userAnswer || '_' }}</div>
      <div class="number-pad">
        <div v-for="n in [1,2,3,4,5,6,7,8,9,0]" :key="n" class="number-button" @click="inputNumber(n)">
          {{ n }}
        </div>
        <div class="number-button" @click="deleteLast">⌫</div>
        <div class="number-button" @click="submitAnswer">=</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameComponent',
  props: {
    difficulty: {
      type: Number,
      default: 5
    },
    duration: {
      type: Number,
      default: 7
    },
    operations: {
      type: String,
      default: 'addition'
    }
  },
  data() {
    return {
      currentProblem: { question: '', answer: 0 },
      userAnswer: '',
      startTime: null,
      elapsed: 0,
      timer: null,
      localDifficulty: this.difficulty,
      localDuration: this.duration,
      localOperations: this.operations,
      totalProblems: 25,
      currentProblemNumber: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    };
  },
  computed: {
    formattedTime() {
      const totalDuration = this.localDuration * 60 * 1000;
      let secondsLeft = (totalDuration - this.elapsed) / 1000;
      let minutes = Math.floor(secondsLeft / 60);
      let seconds = Math.floor(secondsLeft % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  mounted() {
    this.localDifficulty = parseInt(this.$route.query.difficulty, 10) || this.difficulty;
    this.localDuration = parseInt(this.$route.query.duration, 10) || this.duration;

    const operationsQueryParam = this.$route.query.operations;
    this.localOperations = operationsQueryParam
        ? operationsQueryParam.split(',')
        : this.operations;

    this.startGame();
  },
  methods: {
    startGame() {
      this.startTime = Date.now();
      this.timer = setInterval(() => {
        this.elapsed = Date.now() - this.startTime;
        if (this.elapsed >= this.localDuration * 60 * 1000) {
          this.endGame();
        }
      }, 1000);
      this.generateTask();
    },
    generateTask() {
      // Выбор случайной операции из массива операций
      const randomOperation = this.localOperations[Math.floor(Math.random() * this.localOperations.length)];
      let operand1, operand2, answer;

      // Генерация задачи в зависимости от выбранной операции
      switch (randomOperation) {
        case 'addition':
          operand1 = Math.ceil(Math.random() * 10 * this.localDifficulty);
          operand2 = Math.ceil(Math.random() * 10 * this.localDifficulty);
          answer = operand1 + operand2;
          break;
        case 'subtraction':
          operand1 = Math.ceil(Math.random() * 10 * this.localDifficulty);
          operand2 = Math.ceil(Math.random() * operand1);
          answer = operand1 - operand2;
          break;
        case 'multiplication':
          operand1 = Math.ceil(Math.random() * this.localDifficulty);
          operand2 = Math.ceil(Math.random() * this.localDifficulty);
          answer = operand1 * operand2;
          break;
        case 'division':
          operand2 = Math.ceil(Math.random() * this.localDifficulty);
          answer = Math.ceil(Math.random() * this.localDifficulty);
          operand1 = operand2 * answer;
          break;
        case 'exponentiation':
          operand1 = Math.ceil(Math.random() * this.localDifficulty);
          operand2 = Math.floor(Math.random() * 2) + 2;
          answer = Math.pow(operand1, operand2);
          break;
        default:
          console.error('Неизвестная операция: ', randomOperation);
          return;
      }

      this.currentProblem = {
        question: `${operand1} ${this.getOperationSymbol(randomOperation)} ${operand2}`,
        answer: answer
      };
    },
    getOperationSymbol(operation) {
      switch (operation) {
        case 'addition':
          return '+';
        case 'subtraction':
          return '-';
        case 'multiplication':
          return '×';
        case 'division':
          return '÷';
        case 'exponentiation':
          return '^';
        default:
          return '';
      }
    },
    inputNumber(number) {
      this.userAnswer += number.toString();
    },
    deleteLast() {
      this.userAnswer = this.userAnswer.slice(0, -1);
    },
    submitAnswer() {
      if (parseInt(this.userAnswer) === this.currentProblem.answer) {
        this.correctAnswers++;
        this.$emit('correct-answer');
      } else {
        this.wrongAnswers++;
        this.$emit('wrong-answer');
      }
      this.userAnswer = '';
      this.currentProblemNumber++;
      if (this.currentProblemNumber >= this.totalProblems) {
        this.endGame();
      } else {
        this.generateTask();
      }
    },
    endGame() {
      // Расчет последнего результата
      const lastResult = {
        correct: this.correctAnswers,
        total: this.totalProblems,
        accuracy: parseFloat(((this.correctAnswers / this.totalProblems) * 100).toFixed(2)) // Округляем до двух знаков после запятой
      };
      // Сохраняем результат в localStorage
      localStorage.setItem('lastResult', JSON.stringify(lastResult));

      // Останавливаем таймер и перенаправляем пользователя на главную страницу
      clearInterval(this.timer);
      this.$emit('game-over');
      this.$router.push('/');
    },
    exitGame() {
      clearInterval(this.timer);
      this.$emit('exit');
      this.$router.push('/');
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.game-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.game-header, .game-board {
  max-width: 600px;
  width: 90%;
  margin: 0 auto;
}

.exit-button {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
}

.timer {
  font-size: 2em;
}

.game-board {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.question {
  font-size: 2em;
  margin-bottom: 1rem;
}

.answer {
  font-size: 2em;
  min-height: 50px;
  margin-bottom: 1rem;
}

.number-pad {
  width: 100%;
  max-width: 300px;
}

.number-button {
  padding: 15px;
  font-size: 1.5em;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  transition: background-color 0.3s;
  width: 100%;
}

.number-button:hover {
  background-color: #e8e8e8;
}

.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.number-button:active {
  background-color: #d4d4d4;
}

.game-board {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.timer, .question, .answer {
  text-align: center;
}

.exit-button {
  font-weight: bold;
  font-size: 1.2em;
  margin-left: 10px;
}

.exit-button, .timer {
  width: 48%;
}

.timer {
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 10px;
}
</style>
