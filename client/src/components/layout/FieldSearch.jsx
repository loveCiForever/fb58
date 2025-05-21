import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Clock, X } from "lucide-react";
import axios from "axios";

import { toast } from "react-toastify";
import demofields from "../../data/api/fields.json";
import demoavailablefiedbyiddate from "../../data/api/available_field_by_id_and_date.json";

const FieldSearch = () => {
  const [fields, setFields] = useState([]);
  // console.log(fields);
  const [loadingFields, setLoadingFields] = useState(false);
  const [fieldsError, setFieldsError] = useState(null);

  // form
  const [fieldId, setFieldId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [results, setResults] = useState();
  // const [showModal, setShowModal] = useState(true);
  const [searchError, setSearchError] = useState(null);

  const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

  useEffect(() => {
    axios
      .get(`https://localhost:3000/api/fields`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res;
      })
      .then((json) => {
        if (json.success) {
          setFields(json.data.fields);
        } else {
          throw new Error(json.message);
        }
      })
      .catch((err) => setFieldsError(err.message))
      .finally(() => setLoadingFields(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const payload = { fieldId, date, time };
    // console.log("Payload: ", payload);
    try {
      // const res = axios.post(`${BASE_URL}/api/search-availability`, {
      //   fieldId,
      //   date,
      //   time,
      // });
      // console.log("results:", res);
      setResults(demoavailablefiedbyiddate.data);
      // setShowModal(true);
    } catch (err) {
      console.error("search error:", err);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center w-full py-12 md:py-24 lg:py-32 h-screen">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
              Find Your Perfect Field
            </h2>
            <p className="text-muted-foreground md:text-2xl">
              Search for available pitches by Field name, date, and time
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-card py-10 px-6 shadow-lg mt-8">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Fields dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fields</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  {loadingFields ? (
                    <select
                      value={fieldId}
                      onChange={(e) => setFieldId(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-gray-100 px-9 py-2 text-sm"
                    >
                      <option>Loading…</option>
                    </select>
                  ) : fieldsError ? (
                    <select
                      disabled
                      className="h-10 w-full rounded-md border border-red-300 bg-red-50 px-10 py-2 text-sm"
                    >
                      <option>Error: {fieldsError}</option>
                    </select>
                  ) : (
                    <select
                      className="h-10 w-full rounded-md border border-gray-400 border-input bg-background px-9 py-2 text-sm outline-none"
                      value={fieldId}
                      onChange={(e) => setFieldId(e.target.value)}
                    >
                      <option value="">Any field</option>
                      {fields.map((f) => (
                        <option key={f.id} value={f.id} className="">
                          {f.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Date picker (unchanged) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10 w-full rounded-md border border-gray-400 border-input bg-background pl-9 pr-4 py-2 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Time dropdown (unchanged) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    className="h-10 w-full rounded-md border border-gray-400 border-input bg-background pl-9 pr-4 py-2 text-sm outline-none"
                    value={time}
                    type="time"
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Search button */}
              <div className="flex items-end">
                <button
                  className="flex p-2 items-center justify-center w-full bg-green-500 hover:bg-green-700 text-white font-bold text-lg rounded-lg"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" strokeWidth={3} /> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {results && (
        <div className="w-full max-w-3xl mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Availability</h3>
          <p className="mb-2">
            <strong>Field:</strong> {results.field}
          </p>
          <p className="mb-4">
            <strong>Date:</strong> {results.date}
          </p>

          <ul className="space-y-2">
            {results.availableTimeSlots.map((slot, i) => (
              <div className="flex w-full gap-2">
                <li
                  key={i}
                  className="flex w-4/5 items-center justify-between border border-gray-400 rounded-lg p-3"
                >
                  {/* <div className=""> */}
                  <span>{slot.startTime}</span>
                  <span>→</span>
                  <span>{slot.endTime}</span>
                  {/* </div> */}
                </li>
                <button
                  className={`px-3 w-1/5 py-1 text-md font-bold text-white rounded-md bg-green-500 hover:bg-green-700`}
                >
                  Book Now
                </button>
              </div>
            ))}
          </ul>

          {results.availableTimeSlots.length === 0 && (
            <p className="mt-4 text-center text-gray-500">
              No slots available.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default FieldSearch;
