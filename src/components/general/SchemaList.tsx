import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export function SchemaList({
  list,
  schema,
  setSchema,
}: {
  list: string[];
  schema: string;
  setSchema: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <ScrollArea className="w-72 h-[700px]">
      <div className="p-2">
        <p className="mb-4">Lista de Esquemas</p>
        {list.map((item, idx) => (
          <div key={idx}>
            <Button
              variant="ghost"
              className={`w-full ${
                item === schema && "bg-emerald-700 hover:bg-emerald-800 text-white hover:text-white"
              }`}
              onClick={() => setSchema(item)}
            >
              {item}
            </Button>
            <Separator className="mt-1"/>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
