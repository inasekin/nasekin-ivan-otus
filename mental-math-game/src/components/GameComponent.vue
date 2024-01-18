<template>
  <div class="container mt-5">
    <h1>Игра устного счета</h1>
    <div v-if="!gameOver">
      <p>Время: {{ timeLeft }}</p>
      <p>Пример: {{ currentExample.question }}</p>
      <div class="input-group mb-3">
        <input type="number" v-model="currentAnswer" class="form-control" placeholder="Ваш ответ">
        <button class="btn btn-primary" type="button" @click="submitAnswer">Проверить</button>
      </div>
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
      <p>Счет: {{ score }}</p>
    </div>
    <div v-else>
      <h2>Игра окончена!</h2>
      <p>Ваш результат: {{ score }}</p>
      <button class="btn btn-primary" @click="restartGame">Начать заново</button>
    </div>
  </div>
  <button class="btn btn-secondary" @click="goBack">Вернуться назад</button>
</template>

<script>
export default {
  name: 'GameComponent',
  props: {
    settings: {
      type: Object,
      default: () => ({ difficulty: 5, duration: 7, operations: ['addition'] })
    }
  },
  data() {
    return {
      score: 0,
      currentExample: {
        question: '',
        answer: 0
      },
      currentAnswer: '',
      timeLeft: 0,
      gameOver: false,
      timer: null,
      errorMessage: ''
    };
  },
  mounted() {
    this.loadGameState();
    if (this.settings) {
      this.startGame();
    }
  },
  beforeUnmount() {
    this.saveGameState();
  },
  methods: {
    startGame() {
      this.score = 0;
      this.currentAnswer = '';
      this.timeLeft = this.settings.duration * 60;
      this.gameOver = false;
      this.setTimer();
      this.nextExample();
    },
    setTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.endGame();
        }
      }, 1000);
    },
    generateRandomNumber(max) {
      return Math.floor(Math.random() * max) + 1;
    },
    goBack() {
      this.saveGameState();
      this.$router.push({ name: 'Home' });
    },
    saveGameState() {
      const gameState = {
        score: this.score,
        timeLeft: this.timeLeft
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
    },
    loadGameState() {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const gameState = JSON.parse(savedState);
        this.score = gameState.score;
        this.timeLeft = gameState.timeLeft;
      }
    },
    nextExample() {
      const operation = this.settings.operations[Math.floor(Math.random() * this.settings.operations.length)];
      const num1 = this.generateRandomNumber(10 * this.settings.difficulty);
      const num2 = this.generateRandomNumber(10 * this.settings.difficulty);

      switch (operation) {
        case 'addition':
          this.currentExample.question = `${num1} + ${num2}`;
          this.currentExample.answer = num1 + num2;
          break;
        case 'subtraction':
          this.currentExample.question = `${num1} - ${num2}`;
          this.currentExample.answer = num1 - num2;
          break;
        case 'multiplication':
          this.currentExample.question = `${num1} × ${num2}`;
          this.currentExample.answer = num1 * num2;
          break;
        case 'division':
          // Для деления убедимся, что делитель не равен нулю и результат - целое число
          //eslint-disable-next-line no-case-declarations
          const divisor = this.generateRandomNumber(num1 - 1) + 1; // num1 больше нуля
          this.currentExample.question = `${num1 * divisor} ÷ ${divisor}`;
          this.currentExample.answer = num1; // Результат деления num1 * divisor на divisor
          break;
        case 'exponentiation':
          // Для возведения в степень ограничим размер числа и степени
          // eslint-disable-next-line no-case-declarations
          const base = this.generateRandomNumber(5 * this.settings.difficulty);
          // eslint-disable-next-line no-case-declarations
          const exponent = this.generateRandomNumber(this.settings.difficulty);
          this.currentExample.question = `${base} ^ ${exponent}`;
          this.currentExample.answer = Math.pow(base, exponent);
          break;
        default:
          // Если операция не выбрана, вернем простую операцию сложения
          this.currentExample.question = `${num1} + ${num2}`;
          this.currentExample.answer = num1 + num2;
      }
    },
    submitAnswer() {
      if (parseInt(this.currentAnswer) === this.currentExample.answer) {
        this.score++;
        this.errorMessage = ''; // Сброс сообщения об ошибке при правильном ответе
        this.nextExample();
      } else {
        this.errorMessage = 'Неправильный ответ, попробуйте еще раз!';
      }
      this.currentAnswer = ''; // Сброс поля ввода после каждой попытки
    },
    endGame() {
      this.gameOver = true;
      clearInterval(this.timer);
    },
    restartGame() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.startGame();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
.input-group {
  max-width: 300px;
  margin: auto;
}
.btn-primary, .form-control {
  height: 38px; /* или высота, которая соответствует вашему дизайну */
}
.text-danger {
  margin-top: 10px;
}
</style>