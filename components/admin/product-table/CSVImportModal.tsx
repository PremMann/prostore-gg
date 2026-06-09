"use client";

import { useState, useRef } from "react";
import { Upload, AlertTriangle, CheckCircle, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { parseCSV, importProducts } from "@/lib/import";
import { toast } from "sonner";

interface CSVImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CSVImportModal({ open, onOpenChange, onSuccess }: CSVImportModalProps) {
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "done">("upload");
  const [parseResult, setParseResult] = useState<ReturnType<typeof parseCSV> | null>(null);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [importResult, setImportResult] = useState<{ imported: number; errors: { rowNumber: number; error: string }[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = parseCSV(text);
      setParseResult(result);
      setStep("preview");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!parseResult || parseResult.validProducts.length === 0) return;

    setStep("importing");
    const result = await importProducts(parseResult.validProducts, (current, total) => {
      setImportProgress({ current, total });
    });
    setImportResult(result);
    setStep("done");

    if (result.imported > 0) {
      toast.success(`Imported ${result.imported} products successfully`);
      onSuccess();
    }
    if (result.errors.length > 0) {
      toast.error(`${result.errors.length} products failed to import`);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setParseResult(null);
    setImportResult(null);
    setImportProgress({ current: 0, total: 0 });
  };

  const handleDownloadTemplate = () => {
    const template = `name,slug,category,brand,price,stock,description,nameKh,productCode,sizes,colors,images
"Example Shirt","example-shirt","shirts","Nike","29.99","50","A comfortable cotton shirt","អាវយឺត","SHIRT-001","S;M;L;XL","Red;Blue;Black","https://example.com/img1.jpg;https://example.com/img2.jpg"`;
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleReset();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Products (CSV)</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import products.{" "}
            <button
              onClick={handleDownloadTemplate}
              className="text-primary underline cursor-pointer"
            >
              Download template
            </button>
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Click to upload CSV</p>
              <p className="text-sm text-muted-foreground">or drag and drop your file here</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <div className="text-center">
              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        )}

        {step === "preview" && parseResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Found <strong>{parseResult.validProducts.length}</strong> valid and{" "}
                <strong>{parseResult.errorRows.length}</strong> invalid rows
                (out of {parseResult.totalRows} total)
              </div>
              <Button onClick={handleImport} disabled={parseResult.validProducts.length === 0}>
                <Upload className="mr-2 h-4 w-4" />
                Import {parseResult.validProducts.length} Products
              </Button>
            </div>

            {parseResult.errorRows.length > 0 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {parseResult.errorRows.length} rows with errors
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {parseResult.errorRows.map((row) => (
                    <p key={row.rowNumber} className="text-xs text-red-700">
                      Row {row.rowNumber}: {row.errors.join(", ")}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md border">
              <div className="max-h-64 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 font-medium">#</th>
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Category</th>
                      <th className="text-left p-2 font-medium">Price</th>
                      <th className="text-left p-2 font-medium">Stock</th>
                      <th className="text-left p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.validProducts.slice(0, 50).map((item) => (
                      <tr key={item.rowNumber} className="border-b">
                        <td className="p-2 text-muted-foreground">{item.rowNumber}</td>
                        <td className="p-2">{item.product.name}</td>
                        <td className="p-2">{item.product.category}</td>
                        <td className="p-2">${item.product.price}</td>
                        <td className="p-2">{item.product.stock}</td>
                        <td className="p-2">
                          <span className="inline-flex items-center text-emerald-600 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" /> Valid
                          </span>
                        </td>
                      </tr>
                    ))}
                    {parseResult.validProducts.length > 50 && (
                      <tr>
                        <td colSpan={6} className="p-2 text-center text-muted-foreground text-xs">
                          ...and {parseResult.validProducts.length - 50} more
                        </td>
                      </tr>
                    )}
                    {parseResult.errorRows.map((row) => (
                      <tr key={`err-${row.rowNumber}`} className="border-b bg-red-50/50">
                        <td className="p-2 text-muted-foreground">{row.rowNumber}</td>
                        <td className="p-2">{row.data.name || "-"}</td>
                        <td className="p-2">{row.data.category || "-"}</td>
                        <td className="p-2">{row.data.price || "-"}</td>
                        <td className="p-2">{row.data.stock || "-"}</td>
                        <td className="p-2">
                          <span className="inline-flex items-center text-red-600 text-xs">
                            <X className="h-3 w-3 mr-1" /> {row.errors.length} error(s)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {step === "importing" && (
          <div className="space-y-4 py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-lg font-medium">Importing products...</p>
            <p className="text-sm text-muted-foreground">
              {importProgress.current} of {importProgress.total} processed
            </p>
            <div className="w-full bg-muted rounded-full h-2 max-w-md mx-auto">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${importProgress.total > 0 ? (importProgress.current / importProgress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {step === "done" && importResult && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              {importResult.errors.length === 0 ? (
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
              )}
              <p className="text-lg font-medium">
                {importResult.imported} product(s) imported successfully
              </p>
              {importResult.errors.length > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  {importResult.errors.length} product(s) failed
                </p>
              )}
            </div>

            {importResult.errors.length > 0 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 max-h-40 overflow-y-auto">
                {importResult.errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-700">
                    Row {err.rowNumber}: {err.error}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {step === "done" && (
            <>
              <Button variant="outline" onClick={handleReset}>Import Another File</Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </>
          )}
          {step === "preview" && (
            <Button variant="outline" onClick={handleReset}>Cancel</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}