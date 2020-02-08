import React, { useState, useContext, useEffect, useCallback } from "react";
import { Form, InputGroup } from "react-bootstrap";
import RequestContext from "../../contexts/RequestContext";
import { FiSearch } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

export const KeywordFilter: React.FC = () => {
  const context = useContext(RequestContext);
  const [selected, setSelected] = useState<string>(context.filters.keyword);

  //filters change, update our state
  useEffect(() => {
    setSelected(context.filters.keyword);
  }, [context.filters]);

  //apply the filter when our state changes
  useEffect(() => {
    if (
      context.filters.keyword !== selected &&
      (selected === "" || selected.length >= 3)
    ) {
      context.applyFilters({ ...context.filters, keyword: selected }, true);
    }
  }, [selected]);

  //capture escape key presses
  useEffect(() => {
    document.addEventListener("keydown", onEscapePressed, false);
    return () => {
      document.removeEventListener("keydown", onEscapePressed, false);
    };
  }, []);

  const onChangeSelection = (e: any) => {
    if (!context.loading) {
      setSelected(e.target.value || "");
    }
  };

  const onEscapePressed = useCallback((event: any) => {
    //todo: make sure this control is in focus
    if (event.keyCode === 27) {
      onChangeSelection({ target: { value: "" } });
    }
  }, []);

  return (
    <>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <FiSearch />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          disabled={context.loading}
          size="lg"
          type="text"
          value={selected}
          placeholder="Type a keyword to search"
          onChange={(e: any) => {
            onChangeSelection(e);
          }}
        />
      </InputGroup>
      <div
        onClick={() => onChangeSelection({ target: { value: "" } })}
        className="text-secondary"
        style={{
          display: selected == "" ? "none" : "inline",
          position: "absolute",
          top: 0,
          right: 0,
          cursor: "pointer",
          marginRight: "2rem",
          opacity: "40%",
          marginTop: "1.6rem",
          fontSize: "1.5rem",
          zIndex: 3
        }}
      >
        <FaTimes />
      </div>
    </>
  );
};
