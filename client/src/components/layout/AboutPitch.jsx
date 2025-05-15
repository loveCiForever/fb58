const AboutPitch = ({ selectedPitch }) => {
  return (
    <ul className="flex flex-col text-gray-800 tracking-wide list-disc ml-8 gap-2 mt-2">
      <li>Description: {selectedPitch.full_description}</li>
      <li>
        <div>
          <span>Type of grass: </span>{" "}
          <span className="font-bold">{selectedPitch.grass_type}</span>
        </div>
      </li>
      <li>
        <div>
          <span>Lighting system: </span>
          <span className="font-bold">
            {selectedPitch.lighting_system.number_bulbs} bulbs{" "}
            {selectedPitch.lighting_system.power}
          </span>
        </div>
      </li>
      <li>
        <div>
          <span>Numbers of seat:</span>
          <span className="font-bold"> {selectedPitch.capacity.seats}</span>
        </div>
      </li>
      <li>
        <div>
          <span>Numbers of players:</span>
          <span className="font-bold"> {selectedPitch.capacity.players}</span>
        </div>
      </li>

      <li>
        <div>
          Price:
          <span className="font-bold">
            {" "}
            {Number(selectedPitch.price).toLocaleString("en-US")} VND (no
            lights)
          </span>{" "}
          and{" "}
          <span className="font-bold">
            {Number(selectedPitch.priceWithLights).toLocaleString("en-US")} VND
            (lights)
          </span>
        </div>
      </li>

      <li>
        <div className="flex items-center gap-1">
          <span>Available from</span>
          <span className="font-bold">{selectedPitch.openTime}</span>
          <span>to</span>
          <span className="font-bold">{selectedPitch.closeTime}</span>
        </div>
      </li>
    </ul>
  );
};

export default AboutPitch;
