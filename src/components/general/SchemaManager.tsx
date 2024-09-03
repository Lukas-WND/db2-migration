"use client";

import { api } from "@/api/api";
import { Table, useTablesStore } from "@/stores/TablesStore";
import { useSchemasStore } from "@/stores/SchemaStore";
import { useConnectionsStore } from "@/stores/ConnectionStore";
import { useEffect, useState } from "react";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

export function SchemaTables() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTables, setLoadingTables] = useState(true);
  const [errorTables, setErrorTables] = useState<string | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [unselectedReferenciedTables, setUnselectedReferenciedTables] =
    useState<Table[]>([]);

  const { srcConnection, destConnection } = useConnectionsStore((state) => ({
    srcConnection: state.connections[0],
    destConnection: state.connections[1],
  }));

  const [schemaName, setSchemaname] = useState(destConnection.schema);

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

    if (srcConnection.sgbd) {
      setIsInitialLoading(false);
      fetchSchemas();
    }
  }, [srcConnection.sgbd, schemas, setSchema, isInitialLoading]);

  useEffect(() => {
    async function fetchTables() {
      try {
        if (selectedSchema?.SCHEMANAME != "" && srcConnection.sgbd != "") {
          setLoadingTables(true);
          const sgbd = srcConnection.sgbd;
          const schemaName = selectedSchema?.SCHEMANAME;
          const response = await api.get(`tables-${sgbd}/${schemaName}`);
          setTables(response.data);
        }
      } catch (errorTables) {
        setErrorTables("Erro ao carregar as tabelas...");
      } finally {
        setLoadingTables(false);
      }
    }
    fetchTables();
  }, [selectedSchema, srcConnection.sgbd]);

  useEffect(() => {
    const newUnselectedReferenciedTables: Table[] = [];

    selectedTables.forEach((selTable) => {
      selTable.references.forEach((refTable) => {
        const refTabName = refTable.REFTABNAME;
        if (
          !selectedTables.some((table) => table.table === refTabName) &&
          !newUnselectedReferenciedTables.some(
            (table) => table.table === refTabName
          )
        ) {
          const referencedTable = tables.find(
            (table) => table.table === refTabName
          );
          if (referencedTable) {
            newUnselectedReferenciedTables.push(referencedTable);
          }
        }
      });
    });

    setUnselectedReferenciedTables(newUnselectedReferenciedTables);
  }, [selectedTables, tables]);

  const isTableSelected = (name: string) => {
    return selectedTables.some((table) => table.table === name);
  };

  const handleCheckboxChange = (name: string) => {
    if (isTableSelected(name)) {
      deselectOneTable(name);
    } else {
      selectOneTable(name);
    }
  };

  const handleCheckboxSelectAll = () => {
    if (selectedTables.length === tables.length) {
      deselectAllTables();
    } else {
      selectAllTables();
    }
  };

  const handleMigrateOnlyTables = async () => {
    const data = {
      srcConn: srcConnection.sgbd,
      srcSchema: selectedSchema?.SCHEMANAME,
      destConn: destConnection.sgbd,
      destSchema: schemaName,
      arrTables: selectedTables.map((item) => item.table),
      migrateData: false,
    };

    try {
      setLoadingRequest(true);
      const response = await api.post("/migrate", data);

      // if (response.status === 200) {
      //   window.location.href = "/success";
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequest(false);
    }
  };

  const handleMigrateTablesAndData = async () => {
    const data = {
      srcConn: srcConnection.sgbd,
      srcSchema: selectedSchema?.SCHEMANAME,
      destConn: destConnection.sgbd,
      destSchema: schemaName,
      arrTables: selectedTables.map((item) => item.table),
      migrateData: true,
    };

    try {
      setLoadingRequest(true);
      const response = await api.post("/migrate", data);

      // if (response.status === 200) {
      //   window.location.href = "/success";
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequest(false);
    }
  };

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
              <div className="w-full h-full m-4">
                {selectedSchema == null ? (
                  "Selecione um schema."
                ) : loadingTables ? (
                  "Carregando..."
                ) : errorTables ? (
                  <p className="text-red-500">{errorTables}</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <Checkbox
                        checked={selectedTables.length === tables.length}
                        onCheckedChange={handleCheckboxSelectAll}
                        className="checked:bg-emerald-600"
                      />
                      <p>Selecionar todas as tabelas</p>
                    </div>
                    {tables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Checkbox
                          checked={isTableSelected(item.table)}
                          onCheckedChange={() =>
                            handleCheckboxChange(item.table)
                          }
                        />
                        <p>{item.table}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
            <div className="w-1/2">
              {unselectedReferenciedTables.length > 0 && (
                <div className="w-full flex flex-col gap-4 p-4">
                  <div>
                    <h2 className="text-lg">Tabelas Referenciadas</h2>
                    <p className="text-slate-500 mt-4">
                      Estas tabelas são referenciadas em alguma outra tabela e
                      precisa ser marcada para dar continuidade para a migração
                    </p>
                  </div>
                  <div>
                    {unselectedReferenciedTables.map((item, idx) => (
                      <p key={idx} className="text-red-500">
                        {item.table}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between mt-4 py-4 items-center">
        <div className="flex gap-2 items-center">
          <Label className="text-nowrap">Nome do novo Schema</Label>
          <Input
            placeholder="Insira o nome do schema..."
            value={schemaName}
            onChange={(e) => setSchemaname(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="text-white bg-emerald-600 hover:bg-emerald-800"
            onClick={() => handleMigrateOnlyTables()}
          >
            Somente Tabelas
          </Button>
          <Button
            className="text-white bg-emerald-600 hover:bg-emerald-800"
            onClick={() => handleMigrateTablesAndData()}
          >
            Tabelas e Dados
          </Button>
        </div>
      </div>
    </div>
  );
}
