import { useState, KeyboardEvent, useMemo, ReactNode, Children } from "react";
import React from "react";
import { render, findByLabelText } from "@testing-library/react";
import { InputText } from "./InputText";
import SelectList, { SelectChild } from "./SelectList";
import Fuse from "fuse.js";
import { createUseStyles } from "react-jss";

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

interface SearchableSelectChild extends SelectChild {
  // TODO: refactor to use arbitrary searchable properties
  searchableText: string;
}

interface Props {
  // search text state not managed here so it could be used for other things in the parent
  searchTextValue: string;
  dropdownItems?: SearchableSelectChild[] | undefined;
  inputChildren?: ReactNode;
  onSearchChange: (value: string) => void;
  onSelectChange: (value: string) => void;
  childrenToExcludeIds?: string[];
}
// stateless search + dropdown component
const SearchWithDropdown = ({
  searchTextValue,
  dropdownItems,
  inputChildren,
  onSearchChange,
  onSelectChange,
  ...rest
}: Props) => {
  const classes = useStyles();

  const fuseOptions = {
    keys: ["searchableText"],
  };

  const dropdownItemsAfterSearch = itemsAfterSearch();

  function itemsAfterSearch() {
    if (searchTextValue.length === 0) {
      return dropdownItems;
    }

    if (dropdownItems) {
      const fuse = new Fuse(dropdownItems, fuseOptions);
      const searchResult = fuse.search(searchTextValue);
      const dropdownItemsAfterSearch: (
        | SearchableSelectChild
        | undefined
      )[] = searchResult.map((searchItem) => searchItem.item);
      return dropdownItemsAfterSearch;
    }
  }

  return (
    <div {...rest} className={classes.wrapper}>
      <InputText value={searchTextValue} onTextChange={onSearchChange}>
        {inputChildren}
      </InputText>
      <SelectList
        children={dropdownItemsAfterSearch}
        onChangeSelection={onSelectChange}
        className={classes.dropdown}
      />
    </div>
  );
};

export default SearchWithDropdown;
