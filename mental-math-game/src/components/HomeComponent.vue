<template>
  <div class="home">
    <h1>Привет!</h1>
    <p>Добро пожаловать на {{ trainingDay }} тренировочный день,</p>
    <p>Ваш последний результат - решено {{ lastResult.correct }} из {{ lastResult.total }}.</p>
    <p>Общая точность {{ lastResult.accuracy }}%.</p>

    <div class="settings">
      <div class="form-group">
        <label for="difficulty-range">Сложность: {{ settings.difficulty }}</label>
        <input type="range" id="difficulty-range" v-model="settings.difficulty" min="1" max="10" class="form-control-range">
      </div>

      <div class="form-group">
        <label for="duration-range">Длительность (минуты): {{ settings.duration }}</label>
        <input type="range" id="duration-range" v-model="settings.duration" min="1" max="15" class="form-control-range">
      </div>
      <div class="form-check" v-for="(operation, index) in operations" :key="index">
        <label class="form-check-label">
          <input type="checkbox" class="form-check-input" :value="operation" v-model="settings.operations"> {{ operationsDict[operation] }}
        </label>
      </div>
      <button @click="startGame" class="btn btn-primary">Играть!</button>
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
        total: 0,
        accuracy: 0
      },
      settings: {
        difficulty: 5,
        duration: 7,
        operations: ['addition', 'division', 'exponentiation']
      },
      operations: ['addition', 'subtraction', 'multiplication', 'division', 'exponentiation'],
      operationsDict: {
        'addition': 'Сложение',
        'subtraction': 'Вычитание',
        'multiplication': 'Умножение',
        'division': 'Деление',
        'exponentiation': 'Возведение в степень'
      }
    };
  },
  created() {
    this.loadStats();
    const today = new Date().toISOString().split('T')[0];
    if (!this.lastVisit || this.lastVisit !== today) {
      this.trainingDay++;
      this.lastVisit = today;
      this.saveStats();
    }
  },
  methods: {
    startGame() {
      this.saveStats();
      this.$router.push({
        name: 'Game',
        query: {
          difficulty: this.settings.difficulty,
          duration: this.settings.duration,
          operations: this.settings.operations.join(',') // Преобразуем массив операций в строку
        }
      });
    },
    loadStats() {
      const stats = localStorage.getItem('stats');
      const lastResultData = localStorage.getItem('lastResult');
      const today = new Date().toISOString().split('T')[0];

      if (stats) {
        const parsedStats = JSON.parse(stats);
        this.trainingDay = parsedStats.trainingDay;

        if (parsedStats.lastVisit !== today) {
          this.trainingDay++;
        }
      } else {
        this.trainingDay = 1;
      }

      if (lastResultData) {
        this.lastResult = JSON.parse(lastResultData);
      } else {
        this.lastResult = { correct: 0, total: 0, accuracy: 0 };
      }

      this.lastVisit = today;
      this.saveStats();
    },
    saveStats() {
      const stats = {
        trainingDay: this.trainingDay,
        lastResult: this.lastResult,
        lastVisit: this.lastVisit
      };
      localStorage.setItem('stats', JSON.stringify(stats));
    },
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.settings {
  margin: 30px auto;
  width: 100%;
}

.form-group, .form-check {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-control-range {
  width: 60%;
}

.btn {
  margin-top: 2rem;
  width: 100%;
}
</style>
