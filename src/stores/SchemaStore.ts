import { create } from "zustand";

export interface Schema {
  SCHEMANAME: string;
}

type SchemasStore = {
  schemas: Schema[];
  selectedSchema: Schema | null;
  setSchemas: (data: Schema[]) => void;
  addSchema: (data: Schema) => void;
  clearSchemas: () => void;
  selectSchema: (schemaName: string) => void;
  deselectSchema: () => void;
};

export const useSchemasStore = create<SchemasStore>((set) => ({
  schemas: [],
  selectedSchema: null,
  setSchemas: (data) => {
    set(() => ({ schemas: data }));
  },
  addSchema: (data) => {
    set((state) => ({
      schemas: [...state.schemas, data],
    }));
  },
  clearSchemas: () => {
    set(() => ({ schemas: [], selectedSchema: null }));
  },
  selectSchema: (schemaName) =>
    set((state) => ({
      selectedSchema:
        state.schemas.find((schema) => schema.SCHEMANAME === schemaName) ||
        null,
    })),
  deselectSchema: () => {
    set(() => ({ selectedSchema: null }));
  },
}));
