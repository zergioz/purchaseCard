import React, { useState } from "react";

export const useFormInputHandler = (inputs: any) => {
  const [formInputs, setFormInputs] = useState<any>(inputs);

  const handleChange = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setFormInputs({ ...formInputs, [name]: value });
  };

  return {
    formInputs: formInputs,
    setFormInputs: setFormInputs,
    handleChange: handleChange
  };
};
