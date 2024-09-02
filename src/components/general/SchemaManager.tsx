"use client";

import { api } from "@/api/api";
import { useSchemasStore } from "@/stores/SchemaStore";
import { useConnectionsStore } from "@/stores/ConnectionStore";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useTablesStore } from "@/stores/TablesStore";

export function SchemaTables() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { srcConnection } = useConnectionsStore((state) => ({
    srcConnection: state.connections[0],
  }));

  const { schemas, selectedSchema, setSchema, selectSchema, clearSchemas } =
    useSchemasStore((state) => ({
      schemas: state.schemas,
      setSchema: state.setSchemas,
      selectSchema: state.selectSchema,
      selectedSchema: state.selectedSchema,
      clearSchemas: state.clearSchemas,
    }));

  const {
    tables,
    selectedTables,
    setTables,
    selectOneTable,
    deselectOneTable,
    selectAllTables,
    deselectAllTables,
    clearTables,
  } = useTablesStore((state) => ({
    tables: state.tables,
    selectedTables: state.selectedTables,
    setTables: state.setTables,
    selectOneTable: state.selectOneTable,
    deselectOneTable: state.deselectOneTable,
    selectAllTables: state.selectAllTables,
    deselectAllTables: state.deselectAllTables,
    clearTables: state.clearTables,
  }));

  useEffect(() => {
    clearSchemas();
    clearTables();
  }, []);

  // Verifica se os dados da store foram carregados antes de realizar a requisição
  useEffect(() => {
    if (!isInitialLoading) return;

    async function fetchSchemas() {
      try {
        if (schemas.length === 0 && srcConnection.sgbd) {
          const sgbd = srcConnection.sgbd;
          const response = await api.get(`${sgbd}-schema`);
          setSchema(response.data);
        }
      } catch (err) {
        setError("Erro ao carregar os schemas.");
      } finally {
        setLoading(false);
      }
    }

    // Aguarda até que os dados do Zustand estejam prontos
    if (srcConnection.sgbd) {
      setIsInitialLoading(false);
      fetchSchemas();
    }
  }, [srcConnection.sgbd, schemas, setSchema, isInitialLoading]);

  useEffect(() => {
    async function fetchTables() {
      try {
        if (selectedSchema?.SCHEMANAME != "" && srcConnection.sgbd != "") {
          const sgbd = srcConnection.sgbd;
          const schemaName = selectedSchema?.SCHEMANAME;
          const response = await api.get(`tables-${sgbd}/${schemaName}`);
          setTables(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchTables();
  }, [selectedSchema, srcConnection.sgbd]);

  return (
    <div className="w-full border rounded-md h-[90vh]">
      <div className="flex gap-10 h-full">
        <div className="w-1/4 h-full border-r p-4">
          <h2 className="text-lg">Lista de Schemas</h2>
          <div className="w-full">
            <ScrollArea className="mt-6 h-full">
              <div className="flex flex-col justify-center gap-2">
                {loading ? (
                  "Carregando..."
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : schemas.length > 0 ? (
                  schemas.map((item, idx) => (
                    <Button
                      key={idx}
                      variant="secondary"
                      className={`${
                        selectedSchema?.SCHEMANAME === item.SCHEMANAME &&
                        "text-white bg-emerald-600 hover:bg-emerald-800"
                      }`}
                      onClick={() => selectSchema(item.SCHEMANAME)}
                    >
                      {item.SCHEMANAME}
                    </Button>
                  ))
                ) : (
                  <p>Nenhum schema encontrado</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="w-3/4 h-full p-4">
          <h2 className="text-lg">Lista de Tabelas</h2>
          <div className="mt-4 w-full border rounded-md flex h-[94%]">
            <ScrollArea className="h-full w-1/2 border-r">
              <div className="w-full h-full ">
                {tables.map((item, idx) => (
                  <div key={idx}>{item.table}</div>
                ))}
              </div>
            </ScrollArea>
            <div className="w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
