import React from "react";
import { Badge, Nav } from "react-bootstrap";
import { useStatusFilter } from "./StatusFilter";

export const StatusFilterTabs: React.FC = () => {
  const { badges, statuses, selected, setSelected } = useStatusFilter();

  const badgeStyle = "danger";

  return (
    <Nav fill variant="tabs" defaultActiveKey={selected}>
      {statuses.map((value: string, index: number) => (
        <Nav.Item key={`selector-${value}-${index}`}>
          <Nav.Link
            onClick={() => setSelected(value)}
            eventKey={value}
            active={value == selected}
          >
            {value}{" "}
            <Badge variant={!!badges[index] ? badgeStyle : "light"}>
              {badges[index]}
            </Badge>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};
