// frontend/src/components/StarField.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface StarFieldProps {
  speed: number; // Speed multiplier (0 = stop, 1 = normal, >1 = faster)
}

export function StarField({ speed }: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const starData = useMemo(() => {
    const starCount = 15000;
    const depth = 1000;
    const spread = 1000;
    const vertices = [];
    const velocities = [];
    const originalPositions = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = Math.random() * -depth;
      vertices.push(x, y, z);
      originalPositions.push(x, y, z);
      velocities.push(Math.random() * 0.5 + 0.1);
    }
    return { vertices, velocities, originalPositions, depth, starCount };
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, starData.depth + 50);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize pixel ratio

    while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starData.vertices, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
       if (camera && renderer) {
           camera.aspect = width / height;
           camera.updateProjectionMatrix();
           renderer.setSize(width, height);
       }
    };
    window.addEventListener('resize', handleResize);

    const baseSpeed = 0.05;
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const positions = starsGeometry.attributes.position as THREE.BufferAttribute;
      const currentSpeed = speedRef.current;

      if (currentSpeed > 0) {
        for (let i = 0; i < starData.starCount; i++) {
            const zIndex = i * 3 + 2;
            const baseVelocity = starData.velocities[i];
            positions.array[zIndex] += baseVelocity * baseSpeed * currentSpeed;
            if (positions.array[zIndex] > camera.position.z) {
                const originalIndex = i * 3;
                positions.array[originalIndex] = starData.originalPositions[originalIndex];
                positions.array[originalIndex + 1] = starData.originalPositions[originalIndex + 1];
                positions.array[zIndex] = Math.random() * -starData.depth;
            }
        }
        positions.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (containerRef.current && renderer.domElement) containerRef.current.removeChild(renderer.domElement);
      scene.remove(stars);
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, [starData]);

  return <div ref={containerRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1,
      background: 'linear-gradient(to bottom, #0a0a2c, #1a1a3c)'
  }} />;
}