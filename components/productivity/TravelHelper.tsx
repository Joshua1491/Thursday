import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PaperAirplaneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

type TravelRequest = {
  destination: string;
  startDate: string;
  endDate: string;
};

type FlightOption = {
  id: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  stops: number;
};

type HotelOption = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  amenities: string[];
};

type ItineraryResponse = {
  flights: FlightOption[];
  hotels: HotelOption[];
};

async function fetchItinerary(request: TravelRequest): Promise<ItineraryResponse> {
  const response = await fetch('/api/travel/itinerary-suggest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch itinerary');
  }

  return response.json();
}

export function TravelHelper() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: itinerary, mutate: searchItinerary, isPending } = useMutation({
    mutationFn: fetchItinerary,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchItinerary({ destination, startDate, endDate });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter city or country"
              required
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? 'Searching...' : 'Search Options'}
          </button>
        </div>
      </form>

      {/* Results */}
      {isPending ? (
        <div className="text-center py-8">Searching for travel options...</div>
      ) : itinerary ? (
        <div className="space-y-6">
          {/* Flight Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Flight Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itinerary.flights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white shadow rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <PaperAirplaneIcon className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">{flight.airline}</h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Departure: {new Date(flight.departureTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Arrival: {new Date(flight.arrivalTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-600">Stops: {flight.stops}</p>
                    <p className="text-lg font-semibold text-blue-600">
                      ${flight.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hotel Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itinerary.hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white shadow rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">{hotel.name}</h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                    <p className="text-sm text-gray-600">Rating: {'★'.repeat(hotel.rating)}</p>
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      ${hotel.price.toLocaleString()}/night
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 