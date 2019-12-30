import React, { useState } from "react";
import { PersonDirectorates as Directorates } from "../../constants/PersonDirectorates";

interface IProps {
  onChange: (dir: string) => void;
}

export const DirectoratePills = (props: IProps) => {
  const [currentDirectorate, setCurrentDirectorate] = useState<string>("");

  const pillClicked = (directorate: string, e: any) => {
    e.preventDefault();
    setCurrentDirectorate(directorate);
    if (props.onChange) props.onChange(currentDirectorate);
  };

  return (
    <ul className="nav nav-pills">
      {Directorates.map((directorate: string) => (
        <li className="nav-item">
          <a
            className={`nav-link ${
              currentDirectorate == directorate ? "active" : ""
            }`}
            href="#"
            onClick={(e: any) => pillClicked(directorate, e)}
          >
            {directorate}
          </a>
        </li>
      ))}
    </ul>
  );
};
