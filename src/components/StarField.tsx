// src/components/StarField.tsx
import { useEffect, useRef, useMemo } from 'react'; // Removed 'React,'
import * as THREE from 'three';

interface StarFieldProps {
  speed: number; // Speed multiplier (0 = stop, 1 = normal, >1 = faster)
}

export function StarField({ speed }: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const speedRef = useRef(speed); // Ref to store current speed for animation loop

  // Update speedRef whenever the prop changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // --- Memoize star data to avoid recalculation on every render ---
  const starData = useMemo(() => {
    const starCount = 15000;
    const depth = 1000; // How far back stars start
    const spread = 1000; // Increase initial X/Y spread significantly

    const vertices = [];
    const velocities = []; // Store base velocity factor for each star
    const originalPositions = []; // To reset positions

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * spread; // Wider X spread
      const y = (Math.random() - 0.5) * spread; // Wider Y spread
      const z = Math.random() * -depth; // Start behind the camera

      vertices.push(x, y, z);
      originalPositions.push(x, y, z); // Store initial position
      velocities.push(Math.random() * 0.5 + 0.1); // Random base speed factor (0.1 to 0.6)
    }
    return { vertices, velocities, originalPositions, depth, starCount };
  }, []); // Empty dependency array means this runs only once

  useEffect(() => {
    // Ensure containerRef.current exists before proceeding
    if (!containerRef.current || typeof window === 'undefined') return;

    const scene = new THREE.Scene();
    // Adjust FOV slightly if needed, 60 is usually good for perspective
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      starData.depth + 50 // Ensure far plane is beyond the star depth
    );
    camera.position.z = 1; // Keep camera slightly back

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Make canvas background transparent
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Clear previous canvas if any (helps with hot-reloading)
    while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // --- Create Stars ---
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starData.vertices, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02, // Adjust size as needed
      sizeAttenuation: true, // Stars further away appear smaller
      transparent: true,
      opacity: 0.85,
      // Optional: Add slight fog to make distant stars dimmer
      // fog: true
    });
    // Optional: Add fog to the scene
    // scene.fog = new THREE.FogExp2(0x0a0a2c, 0.001); // Match background color if not transparent

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // --- Handle Resize ---
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

    // --- Animation Loop ---
    const baseSpeed = 0.05; // Base movement factor per frame

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const positions = starsGeometry.attributes.position as THREE.BufferAttribute; // Type assertion
      const currentSpeed = speedRef.current; // Get current speed from ref

      // Only animate if speed is positive and positions exist
      if (currentSpeed > 0 && positions) {
        for (let i = 0; i < starData.starCount; i++) {
            const zIndex = i * 3 + 2;
            const baseVelocity = starData.velocities[i];

            // Update Z position
            positions.array[zIndex] += baseVelocity * baseSpeed * currentSpeed;

            // Reset star if it passes the camera
            if (positions.array[zIndex] > camera.position.z) {
                const originalIndex = i * 3;
                // Reset using original position data but with new Z
                positions.array[originalIndex] = starData.originalPositions[originalIndex]; // Reset X
                positions.array[originalIndex + 1] = starData.originalPositions[originalIndex + 1]; // Reset Y
                positions.array[zIndex] = Math.random() * -starData.depth; // Reset Z far back
            }
        }
        positions.needsUpdate = true; // Tell Three.js to update the buffer
      }

      renderer.render(scene, camera);
    };
    animate(); // Start animation

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Check if containerRef.current still exists before removing child
      if (containerRef.current && renderer.domElement) {
        try {
           containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
           console.warn("Could not remove renderer domElement during cleanup:", e);
        }
      }
      // Dispose of Three.js resources
      scene.remove(stars);
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, [starData]); // Rerun effect only if starData changes (which it won't here)

  // Container div
  return <div ref={containerRef} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1, // Keep behind content
      // Define background explicitly here or ensure body/parent has it
      background: 'linear-gradient(to bottom, #0a0a2c, #1a1a3c)'
  }} />;
}