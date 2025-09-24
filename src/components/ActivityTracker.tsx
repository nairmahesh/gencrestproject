import  { useState } from 'react';
import { Button } from './ui/Button';

// From MDO Journey_Simplified.docx
const activityOptions = [
  "Farmer Meets – Small",
  "Farmer Meets – Large",
  "Farm level demos",
  "Wall Paintings",
  "Jeep Campaigns",
  "Field Days",
  "Distributor Day Training Program",
  "Retailer Day Training Program",
  "Distributor Connect Meeting",
  "Dealer/Retailer Store Branding",
  "Trade Merchandise"
];

const ActivityTracker = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [outcome, setOutcome] = useState('');

  const handleLogActivity = () => {
    if (!selectedActivity || !outcome) {
      alert("Please select an activity and provide an outcome.");
      return;
    }
    console.log({
      activity: selectedActivity,
      outcome,
    });
    alert("Activity logged successfully!");
    setSelectedActivity('');
    setOutcome('');
  };

  return (
    <div className="mt-8 rounded-lg border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Log Additional Activities</h2>
      <p className="text-sm text-secondary-foreground mb-4">
        Record any other activities performed during this distributor visit.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="activity-select" className="text-sm font-medium">Activity Type</label>
          <select 
            id="activity-select" 
            value={selectedActivity} 
            onChange={e => setSelectedActivity(e.target.value)}
            className="mt-1 block w-full rounded-md border bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an activity...</option>
            {activityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="activity-outcome" className="text-sm font-medium">Activity Outcome</label>
          <input 
            id="activity-outcome" 
            type="text"
            placeholder="Enter outcome notes..." 
            value={outcome}
            onChange={e => setOutcome(e.target.value)}
            className="mt-1 block w-full rounded-md border bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end border-t pt-4">
        <Button onClick={handleLogActivity}>Log Activity</Button>
      </div>
    </div>
  );
};

export default ActivityTracker;