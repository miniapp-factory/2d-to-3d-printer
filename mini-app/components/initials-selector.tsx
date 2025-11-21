"use client";

import { Button } from "./ui/button";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export interface InitialsSelectorProps {
  initials: string[];
  setInitials: (newInitials: string[]) => void;
  onConfirm: () => void;
}

export function InitialsSelector({ initials, setInitials, onConfirm }: InitialsSelectorProps) {
  const cycleLetter = (index: number, direction: "up" | "down") => {
    const current = initials[index];
    const idx = LETTERS.indexOf(current);
    let newIdx;
    if (direction === "up") {
      newIdx = (idx + 1) % 26;
    } else {
      newIdx = (idx + 25) % 26;
    }
    const newLetter = LETTERS[newIdx];
    const newInitials = [...initials];
    newInitials[index] = newLetter;
    setInitials(newInitials);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <h3 className="text-lg font-semibold">Enter Initials</h3>
      <div className="flex gap-2">
        {initials.map((letter, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <Button size="sm" onClick={() => cycleLetter(idx, "up")}>▲</Button>
            <span className="text-2xl font-mono">{letter}</span>
            <Button size="sm" onClick={() => cycleLetter(idx, "down")}>▼</Button>
          </div>
        ))}
      </div>
      <Button onClick={onConfirm} className="mt-2">OK</Button>
    </div>
  );
}
