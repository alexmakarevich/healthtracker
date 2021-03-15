import { useState } from "react";
import React from "react";
import { SelectChild } from "./SelectList";
import { createUseStyles } from "react-jss";
import SearchWithDropdown from "./SearchWithDropdown";
import Removable from "./Removable";
import Collapsible, { Animations } from "./Collapsible";
import { Button } from "./buttons/Button";
import { Icon, IconSizes } from "./styling/Icon";

const styles = () => ({
  wrapper: {
    display: "flex",
    position: "relative",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    background: "white",
    top: "100%",
    zIndex: "100",
  },
});

const useStyles = createUseStyles(styles, { name: "SearchWithDropdown" });

export interface SearchableSelectChild extends SelectChild {
  // TODO: refactor to use arbitrary searchable properties
  searchableText: string;
}

interface Props {
  dropdownItems?: SearchableSelectChild[];
  onSelect: (value: string) => void;
  onUnselect?: (value: string) => void;
  onCreateNew: (title: string) => void;
  // only used if items aren't added immediately on each select
  onCommitSelected?: () => void;
}

/*
 mostly stateless (except the search input) search + create component
two type of usage at the moment: 
1. pass only unselected dropdown items, and commit changes on each onSelectChange
2. pass list of unselected AND selected dropdown items, commit all changes at once via onCommitSelected

*/

const PickOrAdd = ({
  dropdownItems,
  onSelect,
  onUnselect,
  onCreateNew,
  onCommitSelected,
  ...rest
}: Props) => {
  const classes = useStyles();

  const fuseOptions = {
    keys: ["searchableText"],
  };

  const [searchInput, setSearchInput] = useState("");

  const allSelected =
    dropdownItems &&
    dropdownItems
      .filter((item) => item.isSelected)
      .map((item) =>
        onUnselect ? (
          <Removable onRemove={() => onUnselect(item.id)}>
            {item.node}
          </Removable>
        ) : (
          <div>{item.node}</div>
        )
      );

  const allUnselected =
    dropdownItems && dropdownItems.filter((item) => !item.isSelected);

  return (
    <div {...rest} className={classes.wrapper}>
      <SearchWithDropdown
        searchTextValue={searchInput}
        dropdownItems={allUnselected}
        // in case each selection is not immediately executed, but kept in local state, waiting for a confirmation for all selections.
        // parent controls whether it's used (by providing or not providing selected items as a prop)
        inputChildren={allSelected}
        onSearchChange={(value) => setSearchInput(value)}
        onSelectChange={(id) => {
          onSelect(id);
          setSearchInput("");
        }}
      />

      <Collapsible
        animation={Animations.ExpandWidth}
        isExpanded={searchInput.length > 0}
      >
        <Button
          onClick={() => {
            onCreateNew(searchInput);
            setSearchInput("");
          }}
        >
          <Icon icon={"plus"} size={IconSizes.S} />
          create new
        </Button>
      </Collapsible>
      <Collapsible
        animation={Animations.ExpandWidth}
        isExpanded={!!allSelected && allSelected.length > 0}
      >
        <Button onClick={onCommitSelected}>
          <Icon icon={"plus"} size={IconSizes.S} />
          add selected{" "}
        </Button>
      </Collapsible>
    </div>
  );
};

export default PickOrAdd;
