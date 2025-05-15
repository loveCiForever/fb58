import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

import ImageSlider from "../components/layout/ImageSlider.jsx";
import Landing1 from "../assets/images/landing1.jpg";
import Landing2 from "../assets/images/landing2.jpg";
import Landing3 from "../assets/images/landing3.jpg";
import Landing4 from "../assets/images/landing4.jpg";
import Landing5 from "../assets/images/landing5.jpg";
import FootballField from "../components/ui/FootballField.jsx";
import { Search, MapPin, Calendar, Clock } from "lucide-react";
import FieldSearch from "../components/layout/FieldSearch.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const images = [
    {
      url: Landing1,
      alt: "Slide 1",
      title: "Welcome to our website",
      description: "Discover amazing products and services",
    },
    {
      url: Landing2,
      alt: "Slide 2",
      title: "Special Offers",
      description: "Check out our latest deals and promotions",
    },
    {
      url: Landing3,
      alt: "Slide 3",
      title: "Join Our Community",
      description: "Connect with like-minded individuals",
    },
    {
      url: Landing4,
      alt: "Slide 4",
      title: "Customer Support",
      description: "We're here to help you 24/7",
    },
    {
      url: Landing5,
      alt: "Slide 5",
      title: "Medical Service",
      description: "Our medical team always ready",
    },
  ];

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
        } relative sm:fixed w-full top-0 z-10 `}
      >
        <Header />
      </div>
      <div>
        <main className="bg-gray-50 mt-20">
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
                    anytime, anywhere. Our 24/7 Customer Care team is always
                    ready to assist.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 text-lg">
                    <button
                      className="px-8 py-3 bg-green-600/90 hover:bg-green-300 text-white rounded-lg font-bold transition-colors"
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
                        <FootballField />
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

          <section className="flex flex-col items-center justify-center w-full px-60 py-12 md:py-24 lg:py-32 h-screen">
            <ImageSlider images={images} autoSlideInterval={5000} />
          </section>

          <FieldSearch />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
