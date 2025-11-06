"use client";

import { useState } from "react";
import type { Tag } from "@/lib/data";
import { summarizeLocationHistory, SummarizeLocationHistoryOutput } from "@/ai/flows/summarize-location-history";
import { predictTagLocation, PredictTagLocationOutput } from "@/ai/flows/predict-tag-location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2, Sparkles, LocateFixed, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type AiInsightsProps = {
  tag: Tag;
};

export function AiInsights({ tag }: AiInsightsProps) {
  const [summary, setSummary] = useState<SummarizeLocationHistoryOutput | null>(null);
  const [prediction, setPrediction] = useState<PredictTagLocationOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);

  const handleSummarize = async () => {
    setIsSummaryLoading(true);
    setSummary(null);
    try {
      const result = await summarizeLocationHistory({
        locationHistory: tag.locationHistory,
        timePeriod: "last month",
      });
      setSummary(result);
    } catch (error) {
      console.error("Error summarizing history:", error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handlePredict = async () => {
    setIsPredictionLoading(true);
    setPrediction(null);
    try {
      const result = await predictTagLocation({
        tagId: tag.id,
        historicalLocations: tag.locationHistory,
      });
      setPrediction(result);
    } catch (error) {
      console.error("Error predicting location:", error);
    } finally {
      setIsPredictionLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardHeader className="bg-accent/10">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-accent" />
          <CardTitle className="font-headline text-primary">AI Insights</CardTitle>
        </div>
        <CardDescription>
          Let AI help you understand your tag's patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2"><History className="h-4 w-4"/> Location Summary</h4>
          <Button onClick={handleSummarize} disabled={isSummaryLoading} className="w-full" variant="outline">
            {isSummaryLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Summarize History
          </Button>
          {summary && !isSummaryLoading && (
            <div className="mt-4 text-sm p-4 bg-secondary rounded-lg border">
              {summary.summary}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2"><LocateFixed className="h-4 w-4" /> Location Prediction</h4>
          <Button onClick={handlePredict} disabled={isPredictionLoading} className="w-full" variant="outline">
            {isPredictionLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Predict Likely Location
          </Button>
          {prediction && !isPredictionLoading && (
            <div className="mt-4 text-sm p-4 bg-secondary rounded-lg border space-y-2">
              <p><span className="font-semibold text-foreground">Reason:</span> {prediction.predictedLocation.reason}</p>
              <p><span className="font-semibold text-foreground">Confidence:</span> {Math.round(prediction.predictedLocation.confidence * 100)}%</p>
              <p><span className="font-semibold text-foreground">Location:</span> Lat: {prediction.predictedLocation.latitude.toFixed(4)}, Lon: {prediction.predictedLocation.longitude.toFixed(4)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
