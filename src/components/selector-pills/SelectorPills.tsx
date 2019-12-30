import React, { useState } from "react";

interface IProps {
  values: any[];
  onChange: (dir: string) => void;
}

export const SelectorPills = (props: IProps) => {
  const [currentSelection, updateCurrentSelection] = useState<string>("");

  const pillClicked = (directorate: string, e: any) => {
    e.preventDefault();
    updateCurrentSelection(directorate);
    if (props.onChange) props.onChange(currentSelection);
  };

  return (
    <ul className="nav nav-pills">
      {props.values.map((value: string, index: number) => (
        <li className="nav-item" key={value + index}>
          <a
            className={`nav-link ${currentSelection == value ? "active" : ""}`}
            href="#"
            onClick={(e: any) => pillClicked(value, e)}
          >
            {value}
          </a>
        </li>
      ))}
    </ul>
  );
};
