"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getInventoryLog } from "@/lib/actions/inventory.actions";
import { Package, ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface InventoryLogEntry {
  id: string;
  productId: string;
  type: string;
  quantity: number;
  reason: string | null;
  userId: string | null;
  createdAt: Date;
}

function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

interface InventoryLogModalProps {
  productId: string;
  productName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function InventoryLogModal({ productId, productName, open, setOpen }: InventoryLogModalProps) {
  const [logs, setLogs] = useState<InventoryLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !productId) return;
    setLoading(true);
    getInventoryLog(productId).then((res) => {
      if (res.success && res.data) setLogs(res.data);
      setLoading(false);
    });
  }, [open, productId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory History - {productName}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto pr-4 space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No inventory transactions yet</div>
          ) : (
            logs.map((log: InventoryLogEntry) => (
              <div key={log.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  {log.type === "IN" ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {log.type === "IN" ? "Stock Added" : "Stock Removed"}
                    </p>
                    {log.reason && (
                      <p className="text-xs text-muted-foreground">{log.reason}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(new Date(log.createdAt))}
                    </p>
                  </div>
                </div>
                <Badge variant={log.type === "IN" ? "default" : "destructive"}>
                  {log.type === "IN" ? "+" : "-"}{log.quantity}
                </Badge>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}