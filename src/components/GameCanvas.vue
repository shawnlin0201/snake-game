<template>
  <div class="game-container">
    <div class="canvas-container">
      <canvas
        ref="canvas"
        width="400"
        height="400"
        :class="{ shakeEffect: isShakeEffectActive }"
      ></canvas>
    </div>
    <div class="game-state">
      <p v-if="snakeStore.gameState === GameState.START">
        Press space keys or click button to start
      </p>
      <p v-else-if="snakeStore.gameState === GameState.PLAYING">
        Score: {{ snakeStore.snakeLength }}
      </p>
      <p v-else-if="snakeStore.gameState === GameState.GAME_OVER">
        Game Over! Your score: {{ snakeStore.snakeLength }}
      </p>
      <button v-if="snakeStore.gameState === GameState.START" @click="startGame">Start</button>
      <button v-else-if="snakeStore.gameState === GameState.GAME_OVER" @click="resetGame">
        Restart
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useSnakeStore } from '@/stores/snake'
import { useIntervalFn } from '@vueuse/core'
import { GameState } from '@/constants'

export default {
  setup() {
    const canvas = ref(null)
    const snakeStore = useSnakeStore()
    const context = ref(null)
    let nextDirection = snakeStore.direction

    const isShakeEffectActive = computed(() => snakeStore.snakeLength >= 15)

    const drawGame = () => {
      if (!context.value) return
      context.value.clearRect(0, 0, 400, 400)
      context.value.fillStyle = '#2CDF28'
      snakeStore.snake.forEach((part) => {
        context.value.fillRect(part.x * 20, part.y * 20, 20, 20)
      })

      context.value.fillStyle = 'red'
      context.value.beginPath()
      context.value.arc(
        snakeStore.food.x * 20 + 10,
        snakeStore.food.y * 20 + 10,
        10,
        0,
        2 * Math.PI
      )
      context.value.fill()
    }

    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        if (snakeStore.gameState === GameState.START) {
          startGame()
        }
        if (snakeStore.gameState === GameState.GAME_OVER) {
          resetGame()
        }
      }
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          if (snakeStore.direction !== 'DOWN') nextDirection = 'UP'
          break
        case 's':
        case 'ArrowDown':
          if (snakeStore.direction !== 'UP') nextDirection = 'DOWN'
          break
        case 'a':
        case 'ArrowLeft':
          if (snakeStore.direction !== 'RIGHT') nextDirection = 'LEFT'
          break
        case 'd':
        case 'ArrowRight':
          if (snakeStore.direction !== 'LEFT') nextDirection = 'RIGHT'
          break
      }
    }
    const startGame = () => {
      snakeStore.startGame()
    }
    const resetGame = () => {
      snakeStore.resetGame()
      drawGame()
    }

    onMounted(() => {
      context.value = canvas.value.getContext('2d')
      window.addEventListener('keydown', handleKeyDown)
      drawGame()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyDown)
    })

    useIntervalFn(() => {
      snakeStore.setDirection(nextDirection)
      snakeStore.moveSnake()
      drawGame()
    }, snakeStore.speed)

    return {
      canvas,
      snakeStore,
      startGame,
      resetGame,
      GameState,
      isShakeEffectActive
    }
  }
}
</script>

<style scoped>
.game-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
}
.game-state {
  margin-top: 16px;
  height: 40px;
  font-family: 'KongText';
  text-align: center;
}
.canvas-container {
  position: relative;
  width: 400px;
  height: 400px;
}
canvas {
  border: 4px solid #2cdf28;
  background-color: black;
  display: block;
}

.shakeEffect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: shakeEffect 1s infinite;
}

@keyframes shakeEffect {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

.shakeEffect::before,
.shakeEffect::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  top: 0;
  left: 0;
  display: block;
  mix-blend-mode: multiply;
}

.shakeEffect::before {
  animation: shakeEffect 1s infinite;
  clip: rect(20px, 200px, 30px, 0);
}

.shakeEffect::after {
  animation: shakeEffect 1s infinite;
  clip: rect(85px, 200px, 90px, 0);
}
</style>
