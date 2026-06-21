import { Camera, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { attendanceApi } from "../services/api";

export function ScannerPage() {
  const [token, setToken] = useState("ATTEND|REG-2026-0001|evt_001");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function validateQr() {
    try {
      const result = await attendanceApi.checkIn(token);
      setMessage({ type: "success", text: `${result.name} checked in at ${new Date(result.timestamp).toLocaleTimeString()}` });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Unable to validate QR code." });
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mobile QR Scanner</h1>
        <p className="text-sm text-slate-500">Camera-ready scanner workflow with real-time validation and confirmation feedback.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Scanner</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-border bg-muted">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-primary" />
              <p className="mt-2 font-medium">Camera access area</p>
              <p className="text-sm text-slate-500">Integrate `html5-qrcode` here for production camera detection.</p>
            </div>
          </div>
          <Input value={token} onChange={(event) => setToken(event.target.value)} aria-label="QR token" />
          <Button className="w-full" onClick={validateQr}>Validate QR Check-in</Button>
          {message && (
            <div className={`flex items-center gap-3 rounded-md border p-4 ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
              {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
