import Image from "next/image";
import { ConnectionCard } from "@/components/general/ConnectionCard";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="grid grid-cols-2 gap-x-48">
        <ConnectionCard db="DB2" />
        <ConnectionCard db="MariaDB" />
      </div>
        <div className="mt-24">
        <Button className="w-72 h-12 text-xl bg-emerald-700">Iniciar Migração</Button>
        </div>
    </main>
  );
}
