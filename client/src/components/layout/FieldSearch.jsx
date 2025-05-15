import { Search, MapPin, Calendar, Clock } from "lucide-react";

const FieldSearch = () => {
  return (
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
                    <option value="afternoon">Afternoon (12pm-5pm)</option>
                    <option value="evening">Evening (5pm-10pm)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-end">
                <button className="flex p-2 items-center justify-center w-full bg-green-500 hover:bg-green-400 text-white font-bold text-lg rounded-lg">
                  <Search className="mr-2 h-4 w-4" strokeWidth={3} /> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldSearch;
