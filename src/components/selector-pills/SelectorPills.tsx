import React, { useState } from "react";
import { ButtonToolbar, Button, Badge } from "react-bootstrap";

type Props = {
  values: string[];
  badges?: string[];
  selectedValue?: string;
  changeHandler: (pillSelected: string) => void;
};

export const SelectorPills: React.FC<Props> = props => {
  const [currentSelection, updateCurrentSelection] = useState<string>(
    props.selectedValue ? props.selectedValue : ""
  );

  const handleClick = (value: string) => {
    updateCurrentSelection(value);
    if (props.changeHandler) props.changeHandler(value);
  };

  const spacing = { marginLeft: "0.25em", marginTop: "0.25em" };
  return (
    <ButtonToolbar>
      <Button
        style={spacing}
        size="sm"
        variant={currentSelection == "" ? "danger" : "outline-danger"}
        onClick={() => handleClick("")}
      >
        All{" "}
        {props.badges && props.badges[0] && (
          <Badge variant="light">{props.badges[0]}</Badge>
        )}
      </Button>
      {props.values.map((value: string, index: number) => (
        <Button
          key={`selector-${value}-${index}`}
          size="sm"
          style={spacing}
          variant={
            currentSelection == value || currentSelection == ""
              ? "primary"
              : "outline-primary"
          }
          onClick={() => handleClick(value)}
        >
          {value}{" "}
          {props.badges && props.badges[index + 1] && (
            <Badge variant="light">{props.badges[index + 1]}</Badge>
          )}
        </Button>
      ))}
    </ButtonToolbar>
  );
};
