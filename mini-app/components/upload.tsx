"use client";

import { useState } from "react";

export function Upload() {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
      >
        Take Photo / Upload Image
      </label>
      {file && <p className="text-sm">Selected: {file.name}</p>}
    </div>
  );
}
