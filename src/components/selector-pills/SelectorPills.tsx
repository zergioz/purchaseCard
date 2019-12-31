import React, { useState } from "react";

type Props = {
  values: string[];
  selectedValue?: string;
  changeHandler: (pillSelected: string) => void;
};

export const SelectorPills: React.FC<Props> = props => {
  const [currentSelection, updateCurrentSelection] = useState<string>(
    props.selectedValue ? props.selectedValue : ""
  );

  const pillClicked = (value: string, e: any) => {
    e.preventDefault();
    updateCurrentSelection(value);
    if (props.changeHandler) props.changeHandler(value);
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
