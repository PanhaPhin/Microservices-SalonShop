import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

/* ---------- config ---------- */
const BG = "#050b14";
const GRID_STEP = 2.6; // degrees between land dots
const ARC_SEGMENTS = 48;
const TILT = 0.38; // tilts the north pole toward the viewer
const SPIN = 0.00004; // radians per millisecond
const START_ROTATION = -1.6;

/* Very coarse continent outlines as [longitude, latitude]. */
const CONTINENTS = [
  [[-168,66],[-140,70],[-95,72],[-80,73],[-62,60],[-55,50],[-67,44],[-76,35],[-81,25],[-97,26],[-105,20],[-95,16],[-85,10],[-80,8],[-92,15],[-110,24],[-118,33],[-124,40],[-125,49],[-140,59],[-165,60]],
  [[-55,60],[-45,60],[-20,70],[-22,82],[-60,82],[-70,76]],
  [[-80,10],[-62,11],[-50,0],[-35,-6],[-40,-22],[-48,-28],[-58,-38],[-66,-46],[-72,-53],[-75,-40],[-71,-18],[-81,-5]],
  [[-10,36],[-9,43],[-2,48],[-5,54],[5,62],[15,70],[30,71],[40,66],[40,55],[30,45],[28,41],[20,38],[12,38],[3,37]],
  [[-17,21],[-10,32],[10,37],[32,31],[43,12],[51,11],[40,-5],[40,-16],[33,-27],[20,-35],[13,-24],[9,-2],[8,4],[-8,4],[-17,14]],
  [[30,45],[40,55],[40,66],[60,70],[100,78],[140,72],[180,68],[170,60],[142,50],[135,35],[122,30],[120,22],[108,10],[104,2],[98,10],[92,22],[80,8],[72,20],[57,25],[48,30],[36,36],[28,41]],
  [[114,-22],[122,-18],[136,-12],[142,-11],[153,-27],[150,-37],[140,-38],[129,-32],[115,-34]],
];

/* City hubs as [longitude, latitude]. */
const CITIES = [
  [-74, 40.7],   // 0 New York
  [-122, 37.8],  // 1 San Francisco
  [-99, 19.4],   // 2 Mexico City
  [-46.6, -23.5],// 3 Sao Paulo
  [-0.1, 51.5],  // 4 London
  [37.6, 55.7],  // 5 Moscow
  [3.4, 6.5],    // 6 Lagos
  [18.4, -33.9], // 7 Cape Town
  [31.2, 30],    // 8 Cairo
  [55.3, 25.2],  // 9 Dubai
  [72.9, 19],    // 10 Mumbai
  [103.8, 1.3],  // 11 Singapore
  [116.4, 39.9], // 12 Beijing
  [139.7, 35.7], // 13 Tokyo
  [151.2, -33.9],// 14 Sydney
];

/* Which cities are linked by data arcs. */
const LINKS = [
  [0, 4], [1, 13], [0, 3], [4, 9], [9, 11], [12, 13], [11, 14],
  [4, 6], [6, 7], [8, 10], [5, 12], [2, 0], [1, 2], [10, 11], [4, 5], [3, 6],
];

/* ---------- math helpers ---------- */
const toVector = (lon, lat) => {
  const a = (lat * Math.PI) / 180;
  const o = (lon * Math.PI) / 180;
  return [Math.cos(a) * Math.sin(o), Math.sin(a), Math.cos(a) * Math.cos(o)];
};

const insidePolygon = (lon, lat, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

const buildLandDots = () => {
  const dots = [];
  for (let lat = -78; lat <= 82; lat += GRID_STEP) {
    const lonStep = GRID_STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.2);
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (CONTINENTS.some((shape) => insidePolygon(lon, lat, shape))) {
        dots.push(toVector(lon, lat));
      }
    }
  }
  return dots;
};

// Great-circle path between two cities, lifted above the surface.
const buildArc = ([lonA, latA], [lonB, latB]) => {
  const a = toVector(lonA, latA);
  const b = toVector(lonB, latB);
  const dot = Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
  const omega = Math.acos(dot);
  const lift = 0.05 + 0.2 * (omega / Math.PI);

  return Array.from({ length: ARC_SEGMENTS + 1 }, (_, i) => {
    const t = i / ARC_SEGMENTS;
    const wa = Math.sin((1 - t) * omega) / Math.sin(omega);
    const wb = Math.sin(t * omega) / Math.sin(omega);
    const scale = 1 + lift * Math.sin(Math.PI * t);
    return [
      (wa * a[0] + wb * b[0]) * scale,
      (wa * a[1] + wb * b[1]) * scale,
      (wa * a[2] + wb * b[2]) * scale,
    ];
  });
};

/* Static data, built once. */
const LAND_DOTS = buildLandDots();
const CITY_VECTORS = CITIES.map(([lon, lat]) => toVector(lon, lat));
const ARCS = LINKS.map(([from, to], i) => ({
  points: buildArc(CITIES[from], CITIES[to]),
  offset: (i * 0.37) % 1.5,
  color: i % 3 === 0 ? "167, 139, 250" : "34, 211, 238",
}));

/* ---------- animated globe (canvas) ---------- */
const useGlobe = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let radius = 0;
    let stars = [];
    let frameId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width, height) * 0.46;
      stars = Array.from({ length: 90 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.5 + 0.15,
      }));
    };

    // Rotate a unit vector, then project it onto the screen.
    const project = (v, spin, scale = 1) => {
      const cosS = Math.cos(spin);
      const sinS = Math.sin(spin);
      const x1 = v[0] * cosS + v[2] * sinS;
      const z1 = -v[0] * sinS + v[2] * cosS;
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);
      const y2 = v[1] * cosT - z1 * sinT;
      const z2 = v[1] * sinT + z1 * cosT;
      return {
        x: width / 2 + x1 * radius * scale,
        y: height / 2 - y2 * radius * scale,
        z: z2,
      };
    };

    const drawBackdrop = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        ctx.fillStyle = `rgba(200, 230, 255, ${s.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const cx = width / 2;
      const cy = height / 2;

      // Atmosphere glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.3);
      glow.addColorStop(0, "rgba(34, 211, 238, 0.28)");
      glow.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Ocean sphere
      const sphere = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.35, radius * 0.1, cx, cy, radius
      );
      sphere.addColorStop(0, "#0f2c4a");
      sphere.addColorStop(1, "#06121f");
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawLand = (spin) => {
      LAND_DOTS.forEach((v) => {
        const p = project(v, spin);
        if (p.z <= 0) return;
        ctx.fillStyle = `rgba(56, 189, 248, ${0.2 + p.z * 0.6})`;
        ctx.fillRect(p.x - 0.8, p.y - 0.8, 1.7, 1.7);
      });
    };

    // Draws part of an arc, skipping pieces on the far side of the globe.
    const strokeArc = (arc, from, to, style, lineWidth, spin) => {
      const start = Math.floor(from * ARC_SEGMENTS);
      const end = Math.ceil(to * ARC_SEGMENTS);
      ctx.strokeStyle = style;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      let drawing = false;
      for (let i = start; i <= end; i++) {
        const p = project(arc.points[i], spin);
        if (p.z > 0.05) {
          if (drawing) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
          drawing = true;
        } else {
          drawing = false;
        }
      }
      ctx.stroke();
    };

    const drawArcs = (spin, time) => {
      ARCS.forEach((arc) => {
        strokeArc(arc, 0, 1, `rgba(${arc.color}, 0.16)`, 1, spin);

        // Travelling data packet with a glowing tail
        const phase = (time * 0.0003 + arc.offset) % 1.5;
        const head = Math.min(phase, 1);
        const tail = Math.max(0, phase - 0.3);
        if (tail >= head) return;

        strokeArc(arc, tail, head, `rgba(${arc.color}, 0.95)`, 1.8, spin);

        if (phase <= 1) {
          const p = project(arc.points[Math.round(head * ARC_SEGMENTS)], spin);
          if (p.z > 0.05) {
            ctx.shadowBlur = 14;
            ctx.shadowColor = "#e0f7ff";
            ctx.fillStyle = "#e0f7ff";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });
    };

    const drawCities = (spin, time) => {
      CITY_VECTORS.forEach((v, i) => {
        const p = project(v, spin);
        if (p.z <= 0.1) return;

        // Pulse ring
        const phase = (time / 1800 + i * 0.37) % 1;
        ctx.strokeStyle = `rgba(52, 211, 153, ${(1 - phase) * 0.7 * p.z})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + phase * 12, 0, Math.PI * 2);
        ctx.stroke();

        // Node
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#34d399";
        ctx.fillStyle = "#a7f3d0";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const draw = (time = 0) => {
      const spin = START_ROTATION + (reduceMotion ? 0 : time * SPIN);
      drawBackdrop();
      drawLand(spin);
      drawArcs(spin, reduceMotion ? 600 : time);
      drawCities(spin, reduceMotion ? 0 : time);
      if (!reduceMotion) frameId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const onResize = () => {
      resize();
      if (reduceMotion) draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef]);
};

/* ---------- component ---------- */
const layer = { position: "absolute", inset: 0, pointerEvents: "none" };

const LoginBackground = ({ children }) => {
  const canvasRef = useRef(null);
  useGlobe(canvasRef);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        overflow: "hidden",
        bgcolor: BG,
      }}
    >
      {/* Rotating globe */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ ...layer, width: "100%", height: "100%" }}
      />

      {/* Soft shade behind the card so the form stays readable */}
      <Box
        aria-hidden
        sx={{
          ...layer,
          background:
            "radial-gradient(ellipse at center, rgba(5,11,20,.55) 0%, rgba(5,11,20,.15) 40%, transparent 70%)",
        }}
      />

      {/* Foreground content */}
      <Box
        sx={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default LoginBackground;