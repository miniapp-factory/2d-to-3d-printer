"use client";

import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const FOOD_COLOR = "red";
const SNAKE_COLOR = "lime";
const WALL_COLOR = "gray";

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);

  // Direction helper functions
  const up = () => setDirection({ x: 0, y: -1 });
  const down = () => setDirection({ x: 0, y: 1 });
  const left = () => setDirection({ x: -1, y: 0 });
  const right = () => setDirection({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) up();
          break;
        case "ArrowDown":
          if (direction.y !== -1) down();
          break;
        case "ArrowLeft":
          if (direction.x !== 1) left();
          break;
        case "ArrowRight":
          if (direction.x !== -1) right();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };
        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.y < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }
        // Check self collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [newHead, ...prev];
        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prevScore => prevScore + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const generateFood = (currentSnake: typeof snake) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) break;
    }
    return newFood;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw walls
    ctx.fillStyle = WALL_COLOR;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.fillRect(i * 20, 0, 20, 20);
      ctx.fillRect(i * 20, (GRID_SIZE - 1) * 20, 20, 20);
      ctx.fillRect(0, i * 20, 20, 20);
      ctx.fillRect((GRID_SIZE - 1) * 20, i * 20, 20, 20);
    }
    // Draw food
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
    // Draw snake
    ctx.fillStyle = SNAKE_COLOR;
    snake.forEach(seg => {
      ctx.fillRect(seg.x * 20, seg.y * 20, 20, 20);
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} width={GRID_SIZE * 20} height={GRID_SIZE * 20} className="border" />
      <div className="text-lg">Score: {score}</div>
      {gameOver && <div className="text-2xl text-red-600">Game Over</div>}
    </div>
  );
}
