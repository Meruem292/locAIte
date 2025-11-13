"use client";

import { useState } from "react";
import type { Location } from "@/lib/data";
import { summarizeLocationHistory, SummarizeLocationHistoryOutput } from "@/ai/flows/summarize-location-history";
import { predictTagLocation, PredictTagLocationOutput } from "@/ai/flows/predict-tag-location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2, Sparkles, LocateFixed, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Timestamp } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AiInsightsProps = {
  deviceId: string;
  locationHistory: Location[];
};

export function AiInsights({ deviceId, locationHistory }: AiInsightsProps) {
  const [summary, setSummary] = useState<SummarizeLocationHistoryOutput | null>(null);
  const [prediction, setPrediction] = useState<PredictTagLocationOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);

  const toSerializableLocation = (loc: Location) => {
    let timestampStr: string;
    if (loc.timestamp instanceof Timestamp) {
      timestampStr = loc.timestamp.toDate().toISOString();
    } else if (loc.timestamp instanceof Date) {
      timestampStr = loc.timestamp.toISOString();
    } else {
      timestampStr = loc.timestamp as string;
    }
    return { ...loc, timestamp: timestampStr };
  };

  const handleSummarize = async () => {
    if (!locationHistory || locationHistory.length === 0) return;
    setIsSummaryLoading(true);
    setSummary(null);
    try {
      const serializableHistory = locationHistory.map(toSerializableLocation);
      const result = await summarizeLocationHistory({
        locationHistory: serializableHistory,
        timePeriod: "last 50 locations",
      });
      setSummary(result);
    } catch (error) {
      console.error("Error summarizing history:", error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handlePredict = async () => {
    if (!locationHistory || locationHistory.length === 0) return;
    setIsPredictionLoading(true);
    setPrediction(null);
    try {
      const serializableHistory = locationHistory.map(toSerializableLocation);
      const result = await predictTagLocation({
        tagId: deviceId,
        historicalLocations: serializableHistory,
      });
      setPrediction(result);
    } catch (error) {
      console.error("Error predicting location:", error);
    } finally {
      setIsPredictionLoading(false);
    }
  };
  
  const hasHistory = locationHistory && locationHistory.length > 0;
  
  const predictionSteps = prediction?.predictedLocation.reason
    .split(/\d+\.\s/)
    .filter(step => step.trim() !== '');

  return (
    <Card className="sticky top-24 shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">AI Insights</CardTitle>
        </div>
        <CardDescription>
          {!hasHistory ? "No location history available for AI analysis." : "Understand your tag's patterns with AI."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2"><History className="h-4 w-4 text-muted-foreground"/> Location Summary</h4>
          <Button onClick={handleSummarize} disabled={isSummaryLoading || !hasHistory} className="w-full" variant="secondary">
            {isSummaryLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Summarize History
          </Button>
          {summary && !isSummaryLoading && (
            <div className="mt-4 text-sm p-4 bg-muted/50 rounded-lg border">
              {summary.summary}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2"><LocateFixed className="h-4 w-4 text-muted-foreground"/> Location Prediction</h4>
          <Button onClick={handlePredict} disabled={isPredictionLoading || !hasHistory} className="w-full" variant="secondary">
            {isPredictionLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Predict Likely Location
          </Button>
          {prediction && !isPredictionLoading && (
             <div className="mt-4 text-sm p-4 bg-muted/50 rounded-lg border space-y-4">
                <div>
                    <p><span className="font-semibold text-foreground">Confidence:</span> {Math.round(prediction.predictedLocation.confidence * 100)}%</p>
                    <p><span className="font-semibold text-foreground">Location:</span> Lat: {prediction.predictedLocation.latitude.toFixed(4)}, Lon: {prediction.predictedLocation.longitude.toFixed(4)}</p>
                </div>
                <div className="space-y-2">
                    <h5 className="font-semibold text-foreground">Table of Possibilities</h5>
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[50px]">Step</TableHead>
                                <TableHead>Suggested Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {predictionSteps?.map((step, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{step.trim()}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
