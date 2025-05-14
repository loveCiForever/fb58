import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

import { Search, MapPin, Calendar, Clock } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.title = "Home";
  });

  return (
    <>
      <div
        className={`flex flex-col ${
          isScrolled ? "shadow-2xl" : ""
        } relative w-full top-0 z-10 `}
      >
        <Header />

        <main className="bg-gray-50">
          <section className="flex items-center justify-center py-0 md:py-0 h-[900px]">
            <div className="max-w-8xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    Field Booking with{" "}
                    <span className="text-green-500">FB58</span>
                  </h1>
                  <p className="text-xl mb-8 opacity-80 max-w-xl">
                    Find and book football pitches near you in seconds. Play
                    where and when you want. With Customer Care can support you
                    24/7.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 text-lg">
                    <button
                      className="px-8 py-3 bg-green-500 hover:bg-green-300 text-white rounded-lg font-bold transition-colors"
                      onClick={() => {
                        navigate("/login");
                      }}
                    >
                      Get Started
                    </button>
                    <button
                      className={`px-8 py-3 rounded-lg font-bold  transition-colors hover:bg-gray-200`}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div
                    className={`relative rounded-2xl overflow-hidden shadow-xl p-6`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/20 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-xl font-medium">
                            Field Booking with{" "}
                            <span className="font-bold">FB58</span>
                          </h3>
                        </div>
                      </div>

                      <div className="h-75 w-full bg-gradient-to-r from-green-500/40 to-green-500/70 rounded-lg flex items-center justify-between mb-6">
                        <div className="w-full max-w-4xl mx-auto my-8">
                          <div className="absolute inset-0 flex flex-col">
                            {/* Center line */}
                            <div className="absolute left-1/2 -top-10 bottom-0 w-[2px] bg-white -translate-x-1/2 my-20"></div>

                            {/* Center circle */}
                            <div className="absolute left-1/2 top-1/2 w-[20%] aspect-square rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2"></div>

                            {/* Center spot */}
                            <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"></div>

                            {/* Left penalty spot */}
                            <div className="absolute left-[9%] top-1/2 w-2 h-2 rounded-full bg-white -translate-y-1/2"></div>

                            {/* Right penalty spot */}
                            <div className="absolute right-[9%] top-1/2 w-2 h-2 rounded-full bg-white -translate-y-1/2"></div>

                            {/* Left penalty arc */}
                            <div className="absolute left-[0%] top-1/2 w-[10%] h-[30%] border-2 border-l-0 border-white rounded-r-full -translate-y-1/2"></div>

                            {/* Right penalty arc */}
                            <div className="absolute right-[0%] top-1/2 w-[10%] h-[30%] border-2 border-r-0 border-white rounded-l-full -translate-y-1/2"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className={`px-4 py-2 rounded-lg`}>
                          <span className="text-sm">Fields</span>
                          <div className="text-lg font-bold">10+</div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg `}>
                          <span className="text-sm">Standard</span>
                          <div className="text-lg font-bold">FIFA</div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg `}>
                          <span className="text-sm">Hold</span>
                          <div className="text-lg font-bold">1000+</div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg `}>
                          <span className="text-sm">Medical</span>
                          <div className="text-lg font-bold">24/24</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center w-full py-12 md:py-24 lg:py-32 h-screen">
            <div className="container px-4 md:px-6">
              <div className="mx-auto max-w-5xl space-y-4">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
                    Find Your Perfect Pitch
                  </h2>
                  <p className="text-muted-foreground md:text-2xl">
                    Search for available pitches by location, date, and time
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-card py-10 px-6 shadow-lg mt-8">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="City or postcode"
                          className="flex h-10 w-full rounded-md border border-input border-gray-300  bg-background px-9 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input border-gray-300 bg-background px-9 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Time
                      </label>
                      <div className="flex items-center justify-center relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <select className="flex h-10 w-full rounded-md border border-input border-gray-300  bg-background px-9 py-2 text-sm outline-none">
                          <option value="">Any time</option>
                          <option value="morning">Morning (6am-12pm)</option>
                          <option value="afternoon">
                            Afternoon (12pm-5pm)
                          </option>
                          <option value="evening">Evening (5pm-10pm)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button className="flex p-2 items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg">
                        <Search className="mr-2 h-4 w-4" strokeWidth={3} />{" "}
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
