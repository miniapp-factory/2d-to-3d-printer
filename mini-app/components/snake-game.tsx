"use client";

import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const FOOD_COLOR = "red";
const SNAKE_COLOR = "lime";
const WALL_COLOR = "darkblue";

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
    const stored = localStorage.getItem("snakeLeaderboard");
    if (stored) {
      setLeaderboard(JSON.parse(stored));
    }
  }, []);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);


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
    }, 300);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  useEffect(() => {
    if (gameOver) {
      const name = prompt("Enter your name:") || "Player";
      const newEntry = { name, score };
      const updated = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      setLeaderboard(updated);
      localStorage.setItem("snakeLeaderboard", JSON.stringify(updated));
    }
  }, [gameOver]);

  const generateFood = (currentSnake: typeof snake) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (
        !currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y) &&
        newFood.x !== 0 &&
        newFood.x !== GRID_SIZE - 1 &&
        newFood.y !== 0 &&
        newFood.y !== GRID_SIZE - 1
      ) {
        break;
      }
    }
    return newFood;
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
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
      <div className="flex flex-row items-center justify-between w-full px-4">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={resetGame}
        >
          Try Again
        </button>
        <div className="flex flex-col items-center gap-2">
          <button onClick={up} className="p-4 bg-gray-200 rounded">↑</button>
          <div className="flex gap-2">
            <button onClick={left} className="p-4 bg-gray-200 rounded">←</button>
            <button onClick={right} className="p-4 bg-gray-200 rounded">→</button>
          </div>
          <button onClick={down} className="p-4 bg-gray-200 rounded">↓</button>
        </div>
      </div>
      <div className="mt-4 w-full">
        <h2 className="text-black font-bold text-center mb-2">Top 10 Leaderboard</h2>
        <table className="w-full text-black font-bold">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {gameOver && <div className="text-2xl text-red-600">Game Over</div>}
    </div>
  );
}
