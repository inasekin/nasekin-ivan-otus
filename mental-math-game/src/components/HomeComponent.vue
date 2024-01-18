<template>
  <div class="container my-5 p-3 bg-light shadow">
    <h1 class="text-center mb-4">Привет!</h1>
    <p class="text-center mb-4">Добро пожаловать на {{ trainingDay }} тренировочный день, Ваш последний результат - решено {{ lastResult.correct }} из {{ lastResult.total }}. Общая точность {{ lastResult.accuracy }}%.</p>

    <div class="settings mb-5">
      <h2 class="text-center mb-4">Настройки</h2>

      <div class="mb-3">
        <label for="duration" class="form-label d-block">Длительность (минуты): {{ settings.duration }}</label>
        <input type="range" id="duration" min="1" max="15" v-model="settings.duration" class="form-range">
      </div>

      <div class="mb-3">
        <label for="difficulty" class="form-label d-block">Сложность: {{ settings.difficulty }}</label>
        <input type="range" id="difficulty" min="1" max="10" v-model="settings.difficulty" class="form-range">
      </div>

      <h3 class="text-center mb-3">Типы вычислений</h3>
      <div class="d-flex flex-column align-items-center mb-4">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="addition" value="addition" v-model="settings.operations">
          <label class="form-check-label" for="addition">Суммирование</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="subtraction" value="subtraction" v-model="settings.operations">
          <label class="form-check-label" for="subtraction">Вычитание</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="multiplication" value="multiplication" v-model="settings.operations">
          <label class="form-check-label" for="multiplication">Умножение</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="division" value="division" v-model="settings.operations">
          <label class="form-check-label" for="division">Деление</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="exponentiation" value="exponentiation" v-model="settings.operations">
          <label class="form-check-label" for="exponentiation">Возведение в степень</label>
        </div>
      </div>

      <div class="text-center">
        <button class="btn btn-primary" @click="startGame">Play!</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeComponent',
  data() {
    return {
      trainingDay: 0,
      lastResult: {
        correct: 0,
        total: 25,
        accuracy: 0
      },
      settings: {
        difficulty: 5,
        duration: 7,
        operations: []
      }
    };
  },
  mounted() {
    this.loadLastGameResults();
  },
  methods: {
    startGame() {
      this.$router.push({ name: 'Game', params: { settings: this.settings } });
    },
    loadLastGameResults() {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const gameState = JSON.parse(savedState);
        this.lastResult = {
          correct: gameState.score,
          total: this.lastResult.total,
          accuracy: Math.round((gameState.score / this.lastResult.total) * 100)
        };
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  background-color: #f8f9fa; /* серый фон */
  border-radius: 10px; /* скругленные углы */
  border: 1px solid #e1e1e1; /* тонкая граница для контейнера */
}
.settings {
  margin-top: 20px;
}
.form-label {
  text-align: center;
  display: block;
}
.form-range {
  margin: auto; /* центрирование ползунка */
}
.form-check {
  margin-bottom: 10px; /* отступ между чекбоксами */
}
.btn-primary {
  width: 200px; /* фиксированная ширина кнопки */
}
</style>