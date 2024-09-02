"use client";
import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { SchemaList } from "./SchemaList";
import { Separator } from "../ui/separator";
import { TablesList } from "./TablesList";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function SchemaTables() {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchema, setSelectedSchema] = useState(schemas[0]);
  const [tablesToMigrate, setTablesToMigrate] = useState<string[]>([]);
  const [referencedTables, setReferencedTables] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await api.get("/db2-schema");
        const schemaNames = response.data.map(
          (item: { SCHEMANAME: string }) => item.SCHEMANAME
        );
        setSchemas(schemaNames);
      } catch (err) {
        setError("Erro ao carregar os schemas.");
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full border rounded-md p-2 flex gap-4 relative">
        {referencedTables.length > 0 && (
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <Card className="max-w-96">
              <CardHeader>
                <CardTitle>Tabelas Dependentes</CardTitle>
                <CardDescription>
                  As seguintes tabelas fazem referência à alguma das tabelas
                  selecionadas, e precisam ser migradas juntas
                </CardDescription>
                <CardContent className="mt-8">
                  <div className="flex flex-col text-red-500">
                    {referencedTables.map((tab, idx) => (
                      <p key={idx}>{tab}</p>
                    ))}
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        )}
        <SchemaList
          list={schemas}
          schema={selectedSchema}
          setSchema={setSelectedSchema}
        />
        <TablesList
          schema={selectedSchema}
          tablesToMigrate={tablesToMigrate}
          setTableToMigrate={setTablesToMigrate}
          referencedTables={referencedTables}
          setReferencedTables={setReferencedTables}
        />
      </div>
      <div className="mt-8 w-full flex justify-end">
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-lg px-14" disabled={!!(referencedTables.length > 0)}>
          Migrar Banco
        </Button>
      </div>
    </div>
  );
}
