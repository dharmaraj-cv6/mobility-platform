import { useState } from "react";

import VehicleSuggestions from "./VehicleSuggestions";
import SuggestedDriverCard from "./SuggestedDriverCard";
import DestinationEntry from "./DestinationEntry";

const specialCategories = [
  "Senior citizen",
  "Women only",
  "Pregnant lady",
];

export default function ScheduleRide() {
  const [specialCategory, setSpecialCategory] =
    useState("");

  return (
    <div className="feature-content">

      {/* Date / Time */}
      <div className="form-grid">

        <div className="form-field">
          <label className="form-label">
            Travel date
          </label>

          <input
            type="date"
            className="form-input"
          />
        </div>

        <div className="form-field">
          <label className="form-label">
            Travel time
          </label>

          <input
            type="time"
            className="form-input"
          />
        </div>

      </div>


      {/* Special category */}
      <div className="section-header">
        <h3 className="section-title">
          Special category
        </h3>

        <p className="section-description">
          Select if required
        </p>
      </div>

      <div className="option-list">

        {specialCategories.map(
          (category) => {
            const active =
              specialCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSpecialCategory(
                    active ? "" : category
                  )
                }
                className={`option-chip ${
                  active
                    ? "option-chip--active"
                    : ""
                }`}
              >
                {category}
              </button>
            );
          }
        )}

      </div>


      {/* Vehicle */}
      <div className="section-header">
        <h3 className="section-title">
          Vehicle type
        </h3>
      </div>

      <VehicleSuggestions />


      {/* Suggested driver */}
      <div className="section-header">
        <h3 className="section-title">
          Suggested drivers
        </h3>

        <p className="section-description">
          Based on your selected travel time
        </p>
      </div>

      <SuggestedDriverCard />


      {/* Destination */}
      <DestinationEntry />

    </div>
  );
}