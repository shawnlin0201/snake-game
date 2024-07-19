import { defineStore } from 'pinia'
import { GameState } from '@/constants'

export const useSnakeStore = defineStore({
  id: 'snake',
  state: () => ({
    snake: [{ x: 10, y: 10 }],
    direction: 'RIGHT',
    food: { x: 0, y: 0 },
    gridSize: 20,
    speed: 100,
    gameState: GameState.START
  }),
  getters: {
    snakeLength: (state) => state.snake.length
  },
  actions: {
    setDirection(newDirection) {
      const oppositeDirections = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT'
      }
      if (newDirection !== oppositeDirections[this.direction]) {
        this.direction = newDirection
      }
    },
    moveSnake() {
      if (this.gameState !== GameState.PLAYING) return
      const head = { ...this.snake[0] }

      switch (this.direction) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      this.snake.unshift(head)

      if (head.x === this.food.x && head.y === this.food.y) {
        this.generateFood()
        this.speed = Math.max(50, this.speed - 5)
      } else {
        this.snake.pop()
      }

      this.checkCollision()
    },
    generateFood() {
      const x = Math.floor(Math.random() * this.gridSize)
      const y = Math.floor(Math.random() * this.gridSize)
      this.food = { x, y }
    },
    checkCollision() {
      const [head, ...body] = this.snake
      if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
        this.gameState = GameState.GAME_OVER
      }

      for (let part of body) {
        if (part.x === head.x && part.y === head.y) {
          this.gameState = GameState.GAME_OVER
        }
      }
    },
    resetGame() {
      this.snake = [{ x: 10, y: 10 }]
      this.direction = 'RIGHT'
      this.speed = 100
      this.gameState = GameState.START
      this.generateFood()
    },
    startGame() {
      this.gameState = GameState.PLAYING
      this.generateFood()
    }
  }
})
