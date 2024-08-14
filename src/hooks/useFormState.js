// useFormState.js
import { useState } from 'react';

const initialFormState = {
  broad_genre_must: [],
  broad_genre_can: [],
  broad_genre_exclude: [],
  // add all other form states here
};

const initialSelections = {
  broad_genre: { value: null, condition: 'must' },
  // add all other selection types here
};

const useFormState = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [currentSelections, setCurrentSelections] = useState(initialSelections);

  const handleAddSelection = (type) => {
    const { value, condition } = currentSelections[type];
    if (value && condition) {
      const key = `${type}_${condition}`;
      setFormState((prevState) => ({
        ...prevState,
        [key]: [...prevState[key], value],
      }));
      setCurrentSelections((prev) => ({
        ...prev,
        [type]: { value: null, condition: 'must' },
      }));
    }
  };

  const handleSelect = (type, value) => {
    setCurrentSelections((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        value: value ? value.label : null,
      },
    }));
  };

  const handleConditionChange = (type, condition) => {
    setCurrentSelections((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        condition,
      },
    }));
  };

  const handleDeleteSelection = (type, index, condition) => {
    const key = `${type}_${condition}`;
    setFormState((prevState) => ({
      ...prevState,
      [key]: prevState[key].filter((_, i) => i !== index),
    }));
  };

  return {
    formState,
    setFormState,
    currentSelections,
    setCurrentSelections,
    handleAddSelection,
    handleSelect,
    handleConditionChange,
    handleDeleteSelection,
  };
};

export default useFormState;
