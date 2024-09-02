import { api } from "@/api/api";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Table } from "@/stores/TablesStore";

export function TablesList({
  schema,
  tablesToMigrate,
  setTableToMigrate,
  referencedTables,
  setReferencedTables,
}: {
  schema: string;
  tablesToMigrate: string[];
  referencedTables: string[];
  setTableToMigrate: React.Dispatch<React.SetStateAction<string[]>>;
  setReferencedTables: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTables, setAllTables] = useState(false);

  function isSelected(tabName: string) {
    return tablesToMigrate.includes(tabName);
  }

  function toggleSelection(tabName: string) {
    if (isSelected(tabName)) {
      setTableToMigrate(tablesToMigrate.filter((item) => item !== tabName));
      setReferencedTables(
        referencedTables.filter(
          (referencedTab) =>
            !tables
              .find((item) => item.table === tabName)
              ?.references.map((item) => item.REFTABNAME)
              .includes(referencedTab)
        )
      );
    } else {
      const referenced = tables
        .find((item) => item.table === tabName)
        ?.references.map((item) => item.REFTABNAME);
      setReferencedTables((prev) => [...prev, ...(referenced || [])]);
      setTableToMigrate([...tablesToMigrate, tabName]);
    }
  }

  function selectAllTables() {
    const allTableNames = tables.map((item) => item.table);
    const allReferencedTables = tables.flatMap((item) =>
      item.references.map((referenciedItem) => referenciedItem.REFTABNAME)
    );

    setTableToMigrate(allTableNames);
    setReferencedTables(allReferencedTables);
  }

  function disselectAllTables() {
    setTableToMigrate([]);
    setReferencedTables([]);
  }

  function toggleSelectAllTables() {
    if (allTables) {
      disselectAllTables();
    } else {
      selectAllTables();
    }
    setAllTables(!allTables);
  }

  useEffect(() => {
    async function fetchTables() {
      try {
        setLoading(true);
        const response = await api.get(`/tables-db2/${schema}`);
        const tables = response.data;
        setTables(tables);
      } catch (err) {
        setError("Erro ao carregar as tabelas.");
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, [schema]);

  useEffect(() => {
    setAllTables(tables.length > 0 && tables.length === tablesToMigrate.length);
  }, [tablesToMigrate, tables]);

  if (schema === undefined) {
    return <div>Selecione um Schema.</div>;
  }

  if (loading) {
    return <div>Carregando tabelas...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md p-2">
      <div className="mb-2 flex gap-2 items-center">
        <Checkbox checked={allTables} onCheckedChange={toggleSelectAllTables} />
        <p className="text-xl">Tabelas</p>
      </div>
      {tables.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center mb-1">
          <Checkbox
            checked={isSelected(item.table)}
            onCheckedChange={() => toggleSelection(item.table)}
          />
          <span>{item.table}</span>
        </div>
      ))}
    </div>
  );
}
