"use client";

import { useEffect, useRef } from "react";
import styles from "@/styles/fireworks.module.css";

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Fireworks class
    class Firework {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      speed: number;
      angle: number;
      hue: number;
      brightness: number;
      particles: Particle[];
      
      constructor() {
        // Starting position
        this.x = canvas.width / 2;
        this.y = canvas.height;
        
        // Target position
        this.targetX = Math.random() * canvas.width;
        this.targetY = Math.random() * canvas.height / 2;
        
        // Calculate angle to target
        const distX = this.targetX - this.x;
        const distY = this.targetY - this.y;
        this.angle = Math.atan2(distY, distX);
        
        // Speed and color
        this.speed = 2 + Math.random() * 3;
        this.hue = Math.floor(Math.random() * 360);
        this.brightness = 50 + Math.random() * 20;
        
        // Particles that will be created when firework explodes
        this.particles = [];
      }
      
      update() {
        // Move towards target
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Check if reached target (or close enough)
        const distX = this.targetX - this.x;
        const distY = this.targetY - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        if (distance < 5) {
          return true; // Explode
        }
        return false;
      }
      
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
        ctx!.fill();
      }
      
      explode() {
        const particleCount = 80 + Math.floor(Math.random() * 40);
        for (let i = 0; i < particleCount; i++) {
          this.particles.push(new Particle(this.x, this.y, this.hue));
        }
      }
    }
    
    // Particle class (created when firework explodes)
    class Particle {
      x: number;
      y: number;
      angle: number;
      speed: number;
      friction: number;
      gravity: number;
      hue: number;
      brightness: number;
      alpha: number;
      decay: number;
      
      constructor(x: number, y: number, hue: number) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.cos(Math.random() * Math.PI / 2) * 15;
        this.friction = 0.95;
        this.gravity = 0.3;
        this.hue = hue + Math.random() * 20 - 10;
        this.brightness = 50 + Math.random() * 50;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
      }
      
      update() {
        // Move in direction at the set speed
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        
        // Apply friction to slow down
        this.speed *= this.friction;
        
        // Fade out
        this.alpha -= this.decay;
        
        return this.alpha <= 0;
      }
      
      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx!.fill();
      }
    }
    
    // Arrays to store active fireworks and particles
    const fireworks: Firework[] = [];
    const particles: Particle[] = [];
    
    // Launch new fireworks every so often
    const launchFirework = () => {
      if (fireworks.length < 5) {
        fireworks.push(new Firework());
      }
      setTimeout(launchFirework, Math.random() * 1000 + 500);
    };
    
    // Initial fireworks
    for (let i = 0; i < 3; i++) {
      fireworks.push(new Firework());
    }
    
    // Start launching more fireworks
    launchFirework();
    
    // Animation loop
    const loop = () => {
      // Fading effect
      ctx!.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const shouldExplode = fireworks[i].update();
        fireworks[i].draw();
        
        if (shouldExplode) {
          fireworks[i].explode();
          
          // Add particles to the array
          particles.push(...fireworks[i].particles);
          
          // Remove firework
          fireworks.splice(i, 1);
        }
      }
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const shouldRemove = particles[i].update();
        particles[i].draw();
        
        if (shouldRemove) {
          particles.splice(i, 1);
        }
      }
      
      requestAnimationFrame(loop);
    };
    
    loop();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={styles.fireworks}
    />
  );
}