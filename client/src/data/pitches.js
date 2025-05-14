// src/data/pitches.js
import pitch1Imgs from "../assets/images/pitches/pitch1/1.jpeg";
import pitch2Imgs from "../assets/images/pitches/pitch2/1.jpeg";
import pitch3Imgs from "../assets/images/pitches/pitch3/1.jpeg";
import pitch4Imgs from "../assets/images/pitches/pitch4/1.jpeg";

export const pitches = [
  {
    id: 1,
    name: "Super Vip Field",
    capacity: 10,
    lighting_system: { number_of_bulbs: 10, power: "1000W" },
    grandstand: 100,
    grass: "GrassMaster",
    description:
      "An elite-level playing field offering the highest quality experience for small, exclusive matches.",
    images: pitch1Imgs,
  },
  {
    id: 2,
    name: "Vip Field",
    capacity: 10,
    lighting_system: {
      number_of_bulbs: 10,
      power: "1000W",
    },
    grandstand: 70,
    grass: "GrassMaster",
    description:
      "A premium pitch designed for refined gameplay, perfect for groups looking for top-tier conditions.",
    images: pitch2Imgs,
  },
  {
    id: 3,
    name: "Sand Field",
    capacity: 10,
    lighting_system: {
      number_of_bulbs: 10,
      power: "1000W",
    },
    grandstand: 0,
    grass: "Beach sand",
    description:
      "A sand-surfaced field that adds excitement and challenge to every match, great for beach-style play.",
    images: pitch3Imgs,
  },
  {
    id: 4,
    name: "Main Field",
    capacity: 10,
    lighting_system: {
      number_of_bulbs: 10,
      power: "1000W",
    },
    grandstand: 20,
    grass: "SISGrass",
    description:
      "A central, versatile pitch suitable for a variety of matches, offering a balanced playing experience.",
    images: pitch4Imgs,
  },
];
