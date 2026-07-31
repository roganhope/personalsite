"use client";

import React, { createContext, forwardRef, useCallback, useContext, useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

function FolderIcon({ open, className }: { open?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {open ? (
        <path
          fill="currentColor"
          d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4.55a1.5 1.5 0 0 1 1.2.6l.9 1.2a.5.5 0 0 0 .4.2H19a1.5 1.5 0 0 1 1.47 1.8l-1.2 6.5A2 2 0 0 1 17.3 17H6a2 2 0 0 1-1.98-1.72L3.5 8.5v-2Z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M3.5 6.5A1.5 1.5 0 0 1 5 5h4.55a1.5 1.5 0 0 1 1.2.6l.9 1.2a.5.5 0 0 0 .4.2H19a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-9Z"
        />
      )}
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M6 3.5a1 1 0 0 1 1-1h6.17a1 1 0 0 1 .7.3l3.83 3.82a1 1 0 0 1 .3.71V20.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-17Z"
      />
      <path fill="var(--color-paper)" d="M13 2.9V6a1 1 0 0 0 1 1h3.1L13 2.9Z" />
    </svg>
  );
}

type TreeViewElement = {
  id: string;
  name: string;
  type?: "file" | "folder";
  isSelectable?: boolean;
  children?: TreeViewElement[];
};

type TreeSortMode = "default" | "none" | ((a: TreeViewElement, b: TreeViewElement) => number);

type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a Tree");
  }
  return context;
};

const isFolderElement = (element: TreeViewElement) => {
  if (element.type) {
    return element.type === "folder";
  }
  return Array.isArray(element.children);
};

const treeCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const defaultTreeComparator = (a: TreeViewElement, b: TreeViewElement) => {
  const aIsFolder = isFolderElement(a);
  const bIsFolder = isFolderElement(b);
  if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
  return treeCollator.compare(a.name, b.name);
};

const getTreeComparator = (sort: TreeSortMode) => {
  if (sort === "none") return undefined;
  if (sort === "default") return defaultTreeComparator;
  return sort;
};

const sortTreeElements = (elements: TreeViewElement[], sort: TreeSortMode): TreeViewElement[] => {
  const comparator = getTreeComparator(sort);
  const nextElements = elements.map((element) =>
    Array.isArray(element.children)
      ? { ...element, children: sortTreeElements(element.children, sort) }
      : element
  );
  return comparator ? [...nextElements].sort(comparator) : nextElements;
};

const renderTreeElements = (elements: TreeViewElement[], sort: TreeSortMode): React.ReactNode =>
  sortTreeElements(elements, sort).map((element) =>
    isFolderElement(element) ? (
      <Folder key={element.id} value={element.id} element={element.name} isSelectable={element.isSelectable}>
        {Array.isArray(element.children) ? renderTreeElements(element.children, sort) : null}
      </Folder>
    ) : (
      <File key={element.id} value={element.id} isSelectable={element.isSelectable}>
        <span>{element.name}</span>
      </File>
    )
  );

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  expandedItems?: string[];
  onExpandedItemsChange?: (items: string[]) => void;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  sort?: TreeSortMode;
} & Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>, "defaultValue" | "onValueChange" | "type" | "value">;

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      expandedItems: controlledExpandedItems,
      onExpandedItemsChange,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      sort = "default",
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
    const [internalExpandedItems, setInternalExpandedItems] = useState<string[] | undefined>(initialExpandedItems);

    const isControlled = controlledExpandedItems !== undefined;
    const expandedItems = isControlled ? controlledExpandedItems : internalExpandedItems;

    const selectItem = useCallback((id: string) => setSelectedId(id), []);

    const handleExpand = useCallback(
      (id: string) => {
        const next = expandedItems?.includes(id)
          ? (expandedItems ?? []).filter((item) => item !== id)
          : [...(expandedItems ?? []), id];
        if (isControlled) {
          onExpandedItemsChange?.(next);
        } else {
          setInternalExpandedItems(next);
        }
      },
      [expandedItems, isControlled, onExpandedItemsChange]
    );

    const treeChildren = children ?? (elements ? renderTreeElements(elements, sort) : null);

    return (
      <TreeContext.Provider
        value={{ selectedId, expandedItems, handleExpand, selectItem, indicator, openIcon, closeIcon }}
      >
        <div ref={ref} className={cn("relative w-full", className)}>
          <AccordionPrimitive.Root {...props} type="multiple" value={expandedItems} className="flex flex-col gap-1">
            {treeChildren}
          </AccordionPrimitive.Root>
        </div>
      </TreeContext.Provider>
    );
  }
);

Tree.displayName = "Tree";

const TreeIndicator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute top-0 left-1.5 h-full w-px rounded-md bg-line py-3 duration-300 ease-in-out hover:bg-[#d2cdcf]", className)}
    {...props}
  />
));

TreeIndicator.displayName = "TreeIndicator";

type FolderProps = {
  element: string;
  isSelectable?: boolean;
  isSelect?: boolean;
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const Folder = forwardRef<HTMLDivElement, FolderProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, element, value, isSelectable = true, isSelect, children, ...props }, ref) => {
    const { handleExpand, expandedItems, indicator, selectedId, selectItem, openIcon, closeIcon } = useTree();
    const isSelected = isSelect ?? selectedId === value;
    const isOpen = expandedItems?.includes(value);

    return (
      <AccordionPrimitive.Item ref={ref} {...props} value={value} className="relative h-full overflow-hidden">
        <AccordionPrimitive.Trigger
          className={cn(
            "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[.92rem] font-bold",
            isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
            isSelected && isSelectable && "bg-[#f2f0f1]",
            className
          )}
          disabled={!isSelectable}
          onClick={() => {
            selectItem(value);
            handleExpand(value);
          }}
        >
          {isOpen ? (openIcon ?? <FolderIcon open className="h-4 w-4 shrink-0 text-pink" />) : (closeIcon ?? <FolderIcon className="h-4 w-4 shrink-0 text-muted" />)}
          <span>{element}</span>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="relative h-full overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <AccordionPrimitive.Root type="multiple" className="ml-5 flex flex-col gap-1 py-1" value={expandedItems}>
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  }
);

Folder.displayName = "Folder";

const File = forwardRef<
  HTMLButtonElement,
  {
    value: string;
    handleSelect?: (id: string) => void;
    isSelectable?: boolean;
    isSelect?: boolean;
    fileIcon?: React.ReactNode;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ value, className, handleSelect, onClick, isSelectable = true, isSelect, fileIcon, children, ...props }, ref) => {
  const { selectedId, selectItem } = useTree();
  const isSelected = isSelect ?? selectedId === value;
  return (
    <button
      ref={ref}
      type="button"
      disabled={!isSelectable}
      className={cn(
        "flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-[.88rem] text-muted duration-200 ease-in-out",
        isSelected && isSelectable && "bg-[#f2f0f1] text-ink",
        isSelectable ? "cursor-pointer hover:text-ink" : "cursor-not-allowed opacity-50",
        className
      )}
      onClick={(event) => {
        selectItem(value);
        handleSelect?.(value);
        onClick?.(event);
      }}
      {...props}
    >
      {fileIcon ?? <FileIcon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
});

File.displayName = "File";

export { File, Folder, Tree, type TreeViewElement };
export type { TreeSortMode };
