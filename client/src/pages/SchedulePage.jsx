import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
} from "lucide-react";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import AboutPitch from "../components/layout/AboutPitch.jsx";
import api_booked_time_slots_by_date from "../data/api/booked-time-slots-by-date.json";
import api_fields from "../data/api/fields.json";


const SchedulePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPitchId, setSelectedPitchId] = useState(1);
  const [toggleAboutPitch, setToggleAboutPitch] = useState(false);
  const [bookingModalData, setBookingModalData] = useState(null);
  const [modalStart, setModalStart] = useState("");
  const [modalEnd, setModalEnd] = useState("");
  const [bookings] = useState(api_booked_time_slots_by_date.data);

  const [pitches] = useState(api_fields.data.fields);
  const selectedPitch =
    pitches.find((p) => p.id === selectedPitchId) || pitches[0];

  const fieldData = bookings.fields.find((f) => f.id === selectedPitchId) || {};
  const bookedSlots = fieldData.booked_time_slots || [];

  useEffect(() => {
    if (bookingModalData) {
      setModalStart(bookingModalData.start);
      setModalEnd(bookingModalData.end);
      // console.log(bookingModalData);
    }
  }, [bookingModalData]);

  const parseTime = (t) => {
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + mm;
  };

  const getHour = (t) => {
    const hh = t.split(":").map(Number)[0];
    return hh;
  };

  const isSlotBooked = (time) => {
    const slot = parseTime(time);
    return bookedSlots.some((b) => {
      const start = parseTime(b.startTime);
      const end = b.endTime ? parseTime(b.endTime) : start + 30;
      return slot >= start && slot < end;
    });
  };

  const getBookingForSlot = (time) => {
    const slot = parseTime(time);
    return bookedSlots.find((b) => {
      const start = parseTime(b.startTime);
      const end = b.endTime ? parseTime(b.endTime) : start + 30;
      return slot >= start && slot < end;
    });
  };

  const timeSlots = [];
  for (
    let hour = getHour(selectedPitch.openTime);
    hour < getHour(selectedPitch.closeTime);
    hour++
  ) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  const displaySlots = [];

  for (let i = 0; i < timeSlots.length; i++) {
    const start = timeSlots[i];
    const next = timeSlots[i + 1]
      ? timeSlots[i + 1]
      : (() => {
          const [h, m] = start.split(":").map(Number);
          const endHour =
            m === 0
              ? `${String(h).padStart(2, "0")}:30`
              : `${String(h + 1).padStart(2, "0")}:00`;
          return endHour;
        })();

    const booking = getBookingForSlot(start);
    if (booking) {
      if (start === booking.startTime) {
        displaySlots.push({ start, end: booking.endTime || next, booking });
      }
    } else {
      displaySlots.push({ start, end: next, booking: null });
    }
  }

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleToggleAboutPitch = () => {
    setToggleAboutPitch(!toggleAboutPitch);
  };

  const handleDateSelect = (date) => setSelectedDate(date);
  const handlePitchChange = (id) => setSelectedPitchId(id);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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

  useEffect(() => {
    document.title = "Schedule";
  }, []);

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
              <span className="pitch-selection-label font-medium">
                Select Pitch:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {pitches.map((pitch) => (
                <button
                  key={pitch.id}
                  onClick={() => handlePitchChange(pitch.id)}
                  className={`pitch-selection-btn px-4 py-3 rounded-lg text-left ${
                    pitch.id === selectedPitchId
                      ? "bg-green-600/80 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="pitch-name font-bold">{pitch.name}</div>
                  <div className="short-des text-sm opacity-80">
                    {pitch.short_description}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 px-6 py-4 bg-white border border-gray-300 rounded-lg">
              <button
                className="flex w-full items-center"
                onClick={() => {
                  handleToggleAboutPitch();
                }}
              >
                <CircleAlert className="mr-2 h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-medium">About this pitch</h3>
              </button>

              {toggleAboutPitch && <AboutPitch selectedPitch={selectedPitch} />}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-none border border-gray-300 overflow-hidden">
            <div className="px-6 py-4 border-b-[1px] border-gray-300 bg-gray-50">
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
            </div>
            <div className="divide-y divide-gray-200">
              {displaySlots.map(({ start, end, booking }, idx) => {
                const isBooked = Boolean(booking);
                const labelTime = `${start} - ${end}`;

                return (
                  <div
                    key={idx}
                    className={`px-6 py-3 flex justify-between items-center ${
                      isBooked ? "bg-red-50" : "hover:bg-green-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-md w-32">
                        {labelTime}
                      </span>
                      {isBooked ? (
                        <span className="ml-4 px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                          Booked
                        </span>
                      ) : (
                        <span className="ml-4 px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                          Available
                        </span>
                      )}
                    </div>

                    {isBooked && (
                      <div className="grid grid-cols-3 items-center w-full">
                        <div className="text-right text-lg">
                          {booking.team1}
                        </div>
                        <div className="text-center text-lg font-bold">vs</div>
                        <div className="text-left text-lg">{booking.team2}</div>
                      </div>
                    )}

                    <div>
                      <button
                        onClick={() =>
                          setBookingModalData({
                            startTime: start,
                            endTime: end,
                          })
                        }
                        className={`px-3 py-1 text-md font-medium text-white rounded-md ${
                          isBooked
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isBooked ? "Details" : "Book Now"}
                      </button>
                    </div>

                    {bookingModalData && (
                      <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                          <h2 className="text-xl font-bold mb-4">
                            Book Your Slot
                          </h2>

                          <div className="flex w-full justify-between items-start gap-3">
                            <label className="w-full block mb-2">
                              Start Time
                              <input
                                type="time"
                                step={1800}
                                min={selectedPitch.openTime}
                                max={selectedPitch.closeTime}
                                className="mt-1 block w-full border  border-gray-400 rounded px-2 py-1 outline-none"
                                value={modalStart ?? ""}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setModalStart(e.target.value);
                                }}
                              />
                            </label>
                            <label className="w-full block mb-4">
                              End Time
                              <input
                                type="time"
                                step={1800}
                                min={selectedPitch.openTime}
                                max={selectedPitch.closeTime}
                                className="mt-1 block w-full border border-gray-400 rounded px-2 py-1 outline-none"
                                value={modalEnd ?? ""}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setModalEnd(e.target.value);
                                }}
                              />
                            </label>
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-100"
                              onClick={() => setBookingModalData(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 bg-green-600 font-bold hover:bg-green-500 text-white rounded"
                              onClick={() => {
                                console.log(
                                  "Book from",
                                  modalStart,
                                  "to",
                                  modalEnd
                                );

                                // setBookingModalData(null);
                              }}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
