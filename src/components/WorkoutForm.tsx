import React, { useState, useEffect } from 'react';

/**
 * WorkoutForm Component
 * ---------------------
 * Allows users to log workouts, see total volume,
 * delete individual entries, and persist data to localStorage.
 */

function WorkoutForm() {
  // States for form inputs
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');

  // Main workout list
  const [workouts, setWorkouts] = useState<
    { exercise: string; reps: number; weight: number }[]
  >([]);

  // Load workouts from localStorage when component mounts
  useEffect(() => {
    const saved = localStorage.getItem('workouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
  }, []);

  // Save workouts to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (exercise && reps && weight) {
      setWorkouts([
        ...workouts,
        {
          exercise,
          reps: Number(reps),
          weight: Number(weight),
        },
      ]);

      // Clear form fields
      setExercise('');
      setReps('');
      setWeight('');
    }
  };

  // Handle deleting a specific workout
  const handleDelete = (indexToRemove: number) => {
    setWorkouts(workouts.filter((_, i) => i !== indexToRemove));
  };

  // Handle clearing all workouts
  const handleClearAll = () => {
    const confirmClear = window.confirm('Clear all workouts?');
    if (confirmClear) {
      setWorkouts([]);
    }
  };

  // Calculate total volume (sum of reps × weight)
  const totalVolume = workouts.reduce(
    (total, w) => total + w.reps * w.weight,
    0
  );

  return (
    <>
      {/* Workout Entry Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <h2>Log Your Workout</h2>

        <input
          type="text"
          placeholder="Exercise name"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(Number(e.target.value))}
          required
        />

        <input
          type="number"
          placeholder="Weight (lbs)"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          required
        />

        <button type="submit">Add Workout</button>
      </form>

      {/* Total Volume Display */}
      {workouts.length > 0 && (
        <p>
          <strong>Total Volume:</strong> {totalVolume} lbs
        </p>
      )}

      {/* Clear All Button */}
      {workouts.length > 0 && (
        <button onClick={handleClearAll} className="clear-btn">
          🧹 Clear All Workouts
        </button>
      )}

      {/* Workout List */}
      <ul>
        {workouts.map((w, index) => (
          <li key={index}>
            {w.exercise} — {w.reps} reps @ {w.weight} lbs
            <strong> (Volume: {w.reps * w.weight})</strong>
            <button onClick={() => handleDelete(index)}>❌</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default WorkoutForm;
