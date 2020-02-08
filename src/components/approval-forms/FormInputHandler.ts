import React, { useState } from "react";

export const useByNameFormInputHandler = (inputs: any) => {
  const [formInputs, setFormInputs] = useState<any>(inputs);

  const handleChangeByName = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setFormInputs({ ...formInputs, [name]: value });
  };

  return {
    formInputs: formInputs,
    setFormInputs: setFormInputs,
    handleChangeByName: handleChangeByName
  };
};
