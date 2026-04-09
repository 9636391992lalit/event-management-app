import { useEffect, useState } from "react";

const LocationFilter = ({ onLocationChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // ✅ Fetch Countries
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states")
      .then((res) => res.json())
      .then((data) => setCountries(data.data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ When Country Changes → Load States
  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find(
        (c) => c.name === selectedCountry
      );
      setStates(countryData?.states || []);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry, countries]);

  // ✅ When State Changes → Load Cities
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: selectedCountry,
          state: selectedState,
        }),
      })
        .then((res) => res.json())
        .then((data) => setCities(data.data))
        .catch((err) => console.log(err));
    }
  }, [selectedState]);

  // ✅ Send selected data to parent
  useEffect(() => {
    onLocationChange({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    });
  }, [selectedCountry, selectedState, selectedCity]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold mb-4">Filter by Location</h3>

      {/* Country */}
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.name}>{c.name}</option>
        ))}
      </select>

      {/* State */}
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        disabled={!selectedCountry}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.name}>{s.name}</option>
        ))}
      </select>

      {/* City */}
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedState}
        className="w-full p-2 border rounded"
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city}>{city}</option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;