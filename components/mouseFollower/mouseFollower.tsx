"use client";
import { useEffect, useState } from "react";

export default function MouseFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="fixed w-10 h-10  border-2 border-primary rounded-full transition-transform duration-90"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-20px",
          top: "-20px",
        }}
      />
      <div
        className="fixed w-9 h-9  border-2 border-primary rounded-full transition-transform duration-100"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-18px",
          top: "-18px",
        }}
      />
      <div
        className="fixed w-8 h-8  border-2 border-primary rounded-full transition-transform duration-110"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-16px",
          top: "-16px",
        }}
      />
      <div
        className="fixed w-7 h-7  border-2 border-primary rounded-full transition-transform duration-120"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-14px",
          top: "-14px",
        }}
      />
      <div
        className="fixed w-6 h-6  border-2 border-primary rounded-full transition-transform duration-130"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-12px",
          top: "-12px",
        }}
      />
      <div
        className="fixed w-5 h-5  border-2 border-primary rounded-full transition-transform duration-140"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-10px",
          top: "-10px",
        }}
      />
      <div
        className="fixed w-4 h-4  border-2 border-primary rounded-full transition-transform duration-150"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-8px",
          top: "-8px",
        }}
      />
      <div
        className="fixed w-3 h-3  border-2 border-primary rounded-full transition-transform duration-160"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-6px",
          top: "-6px",
        }}
      />
      <div
        className="fixed w-2 h-2  border-2 border-primary rounded-full transition-transform duration-170"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-4px",
          top: "-4px",
        }}
      />
      <div
        className="fixed w-1 h-1  border-2 border-primary rounded-full transition-transform duration-180"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: "-2px",
          top: "-2px",
        }}
      />
    </>
  );
}
