import { create } from "zustand";

export interface Table {
  table: string;
  references: { REFTABNAME: string }[];
  referencieds: { TABNAME: string }[];
}

type TablesStore = {
  tables: Table[];
  selectedTables: Table[];
  setTables: (data: Table[]) => void;
  selectOneTable: (name: string) => void;
  deselectOneTable: (name: string) => void;
  selectAllTables: () => void;
  deselectAllTables: () => void;
  clearTables: () => void;
};

export const useTablesStore = create<TablesStore>((set) => ({
  tables: [],
  selectedTables: [],

  setTables: (data) => {
    set(() => ({ tables: data }));
  },

  selectOneTable: (name) => {
    set((state) => {
      const tab = state.tables.find((item) => item.table === name);
      return tab ? { selectedTables: [...state.selectedTables, tab] } : state;
    });
  },

  deselectOneTable: (name) => {
    set((state) => ({
      selectedTables: state.selectedTables.filter(
        (item) => item.table !== name
      ),
    }));
  },

  selectAllTables: () => {
    set((state) => ({
      selectedTables: state.tables,
    }));
  },

  deselectAllTables: () => {
    set(() => ({
      selectedTables: [],
    }));
  },

  clearTables: () => {
    set(() => ({
      tables: [],
      selectedTables: [],
    }));
  },
}));
