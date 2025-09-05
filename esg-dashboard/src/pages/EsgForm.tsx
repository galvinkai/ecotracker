"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { esgApi } from "@/services/api";

const MATERIALS = ["Cotton", "Glass", "Petroleum Products", "Plastic", "Steel", "Timber", "Wheat"] as const;

const formSchema = z.object({
    "quantity_used (tons)": z.string().nonempty("Quantity field is required"),
    "carbon_emission (tons CO2)": z.string().nonempty("Carbon Emission field is required"),
    "water_usage (liters)": z.string().nonempty("Water Usage field is required"),
    "waste_generated (tons)": z.string().nonempty("Water Generated field is required"),
    good_used: z.string().nonempty("Goods field is required"),
});

export default function EsgForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "quantity_used (tons)": "",
            "carbon_emission (tons CO2)": "",
            "water_usage (liters)": "",
            "waste_generated (tons)": "",
            good_used: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            const toastId = toast.loading("Analyzing ESG data...");

            // Capitalize the good_used value
            const capitalizedGoodUsed = values.good_used
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");

            // Convert string values to numbers for the API
            const apiData = {
                good_used: capitalizedGoodUsed,
                "quantity_used (tons)": Number(values["quantity_used (tons)"]),
                "carbon_emission (tons CO2)": Number(values["carbon_emission (tons CO2)"]),
                "water_usage (liters)": Number(values["water_usage (liters)"]),
                "waste_generated (tons)": Number(values["waste_generated (tons)"]),
            };

            const responseData = await esgApi.predict(apiData);

            const formattedData = {
                ...values,
                good_used: capitalizedGoodUsed,
                prediction: responseData.prediction,
                recommendation: responseData.recommendation,
            };

            toast.dismiss(toastId);
            toast.success("ESG data submitted successfully!");
            navigate("/chatbot", { state: { formData: formattedData } });
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to analyze ESG data");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8 space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Submit ESG Data</h1>
                <p className="text-muted-foreground">Enter your production data to receive ESG insights and recommendations.</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 rounded-lg border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="good_used"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Material Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a material" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {MATERIALS.map((material) => (
                                                <SelectItem key={material} value={material}>
                                                    {material}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-6 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name={"quantity_used (tons)"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity Used</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., 1000" type="number" min="0" />
                                        </FormControl>
                                        <p className="text-muted-foreground text-xs dark:text-gray-400">Measured in tons</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={"carbon_emission (tons CO2)"}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Carbon Emissions</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., 500" type="number" min="0" />
                                        </FormControl>
                                        <p className="text-muted-foreground text-xs dark:text-gray-400">Measured in tons of CO2</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="water_usage (liters)"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Water Usage</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., 10000" type="number" min="0" />
                                        </FormControl>
                                        <p className="text-muted-foreground text-xs dark:text-gray-400">Measured in litres</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="waste_generated (tons)"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Waste Generated</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="e.g., 100" type="number" min="0" />
                                        </FormControl>
                                        <p className="text-muted-foreground text-xs dark:text-gray-400">Measured in tons</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing ESG Impact...
                            </>
                        ) : (
                            "Submit for Analysis"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
