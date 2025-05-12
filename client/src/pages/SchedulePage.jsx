import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

import booking_api from "../data/bookingApi.json";

const pitchImages = {
  1: Object.values(
    import.meta.glob("../assets/images/pitches/pitch1/*.{jpg,jpeg,png}", {
      eager: true,
      import: "default",
    })
  ),
  2: Object.values(
    import.meta.glob("../assets/images/pitches/pitch2/*.{jpg,jpeg,png}", {
      eager: true,
      import: "default",
    })
  ),
  3: Object.values(
    import.meta.glob("../assets/images/pitches/pitch3/*.{jpg,jpeg,png}", {
      eager: true,
      import: "default",
    })
  ),
  4: Object.values(
    import.meta.glob("../assets/images/pitches/pitch4/*.{jpg,jpeg,png}", {
      eager: true,
      import: "default",
    })
  ),
};

const SchedulePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPitch, setSelectedPitch] = useState(1);

  const pitches = [
    {
      id: 1,
      name: "Super Vip Field",
      capacity: 10,
      description:
        "An elite-level playing field offering the highest quality experience for small, exclusive matches.",
      images: pitchImages[1],
    },
    {
      id: 2,
      name: "Vip Field",
      capacity: 10,
      description:
        "A premium pitch designed for refined gameplay, perfect for groups looking for top-tier conditions.",
      images: pitchImages[2],
    },
    {
      id: 3,
      name: "Sand Field",
      capacity: 10,
      description:
        "A sand-surfaced field that adds excitement and challenge to every match, great for beach-style play.",
      images: pitchImages[3],
    },
    {
      id: 4,
      name: "Main Field",
      capacity: 10,
      description:
        "A central, versatile pitch suitable for a variety of matches, offering a balanced playing experience.",
      images: pitchImages[4],
    },
  ];

  const [bookings] = useState(booking_api.data.bookings);

  const timeSlots = [];
  for (let hour = 8; hour < 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  const formatDate = (date) => date.toISOString().split("T")[0];

  const isBooked = (pitchId, time) => {
    const formatted = formatDate(selectedDate);
    return bookings.some(
      (b) =>
        b.pitchId === pitchId &&
        b.date === formatted &&
        b.startTime <= time &&
        b.endTime > time
    );
  };

  const getBookingDetails = (pitchId, time) => {
    const formatted = formatDate(selectedDate);
    return bookings.find(
      (b) =>
        b.pitchId === pitchId &&
        b.date === formatted &&
        b.startTime <= time &&
        b.endTime > time
    );
  };

  const handleDateSelect = (date) => setSelectedDate(date);
  const handlePitchChange = (id) => setSelectedPitch(id);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = "Schedule";
  }, []);

  const getNextFourteenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const PitchImageSlider = ({ images = [] }) => {
    const [current, setCurrent] = useState(0);
    const len = images.length;
    if (!len) return null;
    const next = () => setCurrent((c) => (c === len - 1 ? 0 : c + 1));
    const prev = () => setCurrent((c) => (c === 0 ? len - 1 : c - 1));

    return (
      <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                idx === current ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const activePitch = pitches.find((p) => p.id === selectedPitch) || pitches[0];

  return (
    <>
      <div
        className={`${
          isScrolled ? "shadow-2xl" : ""
        } relative sm:fixed w-full top-0 z-10`}
      >
        <Header />
      </div>

      <main className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto mt-8">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            {getNextFourteenDays().map((date, idx) => (
              <button
                key={idx}
                onClick={() => handleDateSelect(date)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  formatDate(date) === formatDate(selectedDate)
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Users className="mr-2 h-5 w-5 text-gray-500" />
              <span className="font-medium">Select Pitch:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {pitches.map((pitch) => (
                <button
                  key={pitch.id}
                  onClick={() => handlePitchChange(pitch.id)}
                  className={`px-4 py-3 rounded-lg text-left ${
                    pitch.id === selectedPitch
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{pitch.name}</div>
                  <div className="text-sm opacity-80">
                    Capacity: {pitch.capacity}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <PitchImageSlider images={activePitch.images} />
            </div>

            <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
              <h3 className="text-lg font-medium">Description</h3>
              <p className="mt-2 text-gray-700">{activePitch.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium">
                  Schedule for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">{activePitch.name}</p>
            </div>
            <div className="divide-y divide-gray-200">
              {timeSlots.map((time, idx) => {
                const booked = isBooked(selectedPitch, time);
                const details = booked
                  ? getBookingDetails(selectedPitch, time)
                  : null;
                return (
                  <div
                    key={idx}
                    className={`px-6 py-3 flex justify-between items-center ${
                      booked ? "bg-red-50" : "hover:bg-green-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium w-16">{time}</span>
                      {booked ? (
                        <span className="ml-4 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Booked
                        </span>
                      ) : (
                        <span className="ml-4 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                    <div>
                      {booked ? (
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">{details.team}</span>
                          <span className="mx-1">•</span>
                          <span>
                            {details.startTime} - {details.endTime}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => alert(`Book ${time}`)}
                          className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SchedulePage;
