import { create } from "zustand";

export interface Connection {
  host: string;
  port: string;
  user: string;
  password: string;
  schema: string;
  sgbd: string;
}

interface DBConnectionsStore {
  connections: Connection[];
  updateConnection: (
    index: number,
    field: keyof Connection,
    value: string
  ) => void;
  clearConnections: () => void;
  areConnectionsValid: () => boolean;
}

export const useConnectionsStore = create<DBConnectionsStore>((set, get) => ({
  connections: [
    { host: "", port: "", user: "", password: "", schema: "", sgbd: "" },
    { host: "", port: "", user: "", password: "", schema: "", sgbd: "" },
  ],
  updateConnection: (index, field, value) =>
    set((state) => {
      const updatedConnections = state.connections.map((conn, i) =>
        i === index ? { ...conn, [field]: value } : conn
      );
      return { connections: updatedConnections };
    }),
  clearConnections: () =>
    set({
      connections: [
        { host: "", port: "", user: "", password: "", schema: "", sgbd: "" },
        { host: "", port: "", user: "", password: "", schema: "", sgbd: "" },
      ],
    }),

  // Método para verificar se todos os campos obrigatórios estão preenchidos
  areConnectionsValid: () => {
    const connections = get().connections;
    return connections.every(
      (conn) =>
        conn.host !== "" &&
        conn.port !== "" &&
        conn.user !== "" &&
        conn.password !== "" &&
        conn.sgbd !== ""
    );
  },
}));
