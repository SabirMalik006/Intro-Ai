"use client";

import { useEffect, useRef } from "react";

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.left = e.clientX + "px";
          ringRef.current.style.top = e.clientY + "px";
        }
      }, 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const base = {
    position: "fixed",
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
  };

  return (
    <>
      <div ref={dotRef} style={{ ...base, width: 8, height: 8, background: "#c8f135", borderRadius: "50%", mixBlendMode: "difference" }} />
      <div ref={ringRef} style={{ ...base, width: 36, height: 36, border: "1.5px solid rgba(200,241,53,0.5)", borderRadius: "50%", transition: "width 0.3s ease, height 0.3s ease", zIndex: 9998 }} />
    </>
  );
}

export default Cursor;