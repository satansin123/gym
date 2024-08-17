import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import styled from "styled-components";
import { URL } from "../url";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const DateHeading = styled.h2`
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const WorkoutCard = styled.div`
  background-color: #fff;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExerciseList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ExerciseItem = styled.li`
  background-color: #f1f1f1;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
`;

const Form = styled.form`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Label = styled.label`
  flex: 1;
  margin-right: 10px;
`;

const Input = styled.input`
  flex: 2;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  display: inline-block;
  margin: 10px 5px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const WorkoutList = () => {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [filteredByDate, setFilteredByDate] = useState([]);
  const [openDates, setOpenDates] = useState({});
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${URL}/workouts`, {
          withCredentials: true,
        });
        const flattenedWorkouts = response.data.flat();
        setWorkouts(flattenedWorkouts);
        setFilteredExercises(flattenedWorkouts); // Initial filteredExercises to all workouts
        setFilteredByDate(flattenedWorkouts); // Initial filteredByDate to all workouts
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkouts();
  }, [user]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = workouts.filter((workout) =>
      workout.exercises.some((item) =>
        item.name.toLowerCase().includes(searchTerm)
      )
    );
    setFilteredExercises(filtered);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSearchDate(selectedDate);
    const filtered = workouts.filter(
      (workout) =>
        new Date(workout.date).toISOString().split("T")[0] === selectedDate
    );
    setFilteredByDate(filtered);
  };

  const handleToggleDate = (date) => {
    setOpenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const workoutsByDate = (searchDate ? filteredByDate : filteredExercises).reduce(
    (acc, workout) => {
      const date = new Date(workout.date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(workout);
      return acc;
    },
    {}
  );

  return (
    <Container>
      <form>
        <input
          type="text"
          placeholder="Filter by exercise"
          onChange={handleSearch}
          required
        />
        <input
          type="date"
          value={searchDate}
          onChange={handleDateChange}
        />
      </form>
      {Object.keys(workoutsByDate).length === 0 ? (
        <div>No exercises found</div>
      ) : (
        Object.keys(workoutsByDate).map((date) => (
          <div key={date}>
            <DateHeading onClick={() => handleToggleDate(date)}>
              {date}
            </DateHeading>
            {openDates[date] && (
              <ul>
                {workoutsByDate[date].map((workout) => (
                  <WorkoutCard key={workout._id}>
                    {workout.exercises && workout.exercises.length > 0 ? (
                      <h3>{workout.exercises[0].name}</h3>
                    ) : (
                      <h3>No exercises available</h3>
                    )}
                    <p>Exercises:</p>
                    <ExerciseList>
                      {workout.exercises &&
                        workout.exercises.map((exercise) => (
                          <ExerciseItem key={exercise._id}>
                            <strong>{exercise.name}</strong>
                            <p>Sets: {exercise.sets}</p>
                            <p>Reps: {exercise.reps}</p>
                            <p>Weight: {exercise.weight} KGS</p>
                          </ExerciseItem>
                        ))}
                    </ExerciseList>
                  </WorkoutCard>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </Container>
  );
};

export default WorkoutList;
