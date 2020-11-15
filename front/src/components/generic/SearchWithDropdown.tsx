import {
  useState,
  KeyboardEvent,
  useMemo,
  ReactNode,
  HTMLProps,
  InputHTMLAttributes,
} from "react";
import React from "react";
import { InputText } from "./inputs/InputText";
import SelectList, { SelectChild } from "./SelectList";
import Fuse from "fuse.js";
import { createUseStyles } from "react-jss";
import { useHover } from "../../common/useHover";

const styles = () => ({
  wrapper: {
    display: "flex",
    position: "relative",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
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
  otherInputProps?: InputHTMLAttributes<HTMLInputElement>;
}
// stateless search + dropdown component
const SearchWithDropdown = ({
  searchTextValue,
  dropdownItems,
  inputChildren,
  onSearchChange,
  onSelectChange,
  otherInputProps,
  ...rest
}: Props) => {
  const classes = useStyles();

  const fuseOptions = {
    keys: ["searchableText"],
  };

  const [isDropdwonVisible, setIsDropdwonVisible] = useState(false);

  const dropdownItemsAfterSearch = itemsAfterSearch();

  // TODO: add useMemo

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

  const [dropdownRef, isDropdownHovered] = useHover();

  const { value, ...restInput } = otherInputProps ?? {
    value: undefined,
    undefined,
  };

  return (
    <div
      {...rest}
      className={classes.wrapper}
      onFocus={() => setIsDropdwonVisible(true)}
      onBlur={() => !isDropdownHovered && setIsDropdwonVisible(false)}
    >
      <InputText
        value={searchTextValue}
        onTextChange={onSearchChange}
        {...restInput}
      >
        {inputChildren}
      </InputText>
      {isDropdwonVisible && (
        <SelectList
          ref={dropdownRef}
          children={dropdownItemsAfterSearch}
          onChangeSelection={onSelectChange}
          onFocus={() => setIsDropdwonVisible(true)}
          onBlur={() => setIsDropdwonVisible(false)}
          className={classes.dropdown}
        />
      )}
    </div>
  );
};

export default SearchWithDropdown;
