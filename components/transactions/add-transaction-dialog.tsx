"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTransaction } from "@/app/actions/transactions"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { format } from "date-fns"

const formSchema = z.object({
    amount: z.union([z.string(), z.number()]).refine((val) => {
        const parsed = Number(val)
        return !isNaN(parsed) && parsed > 0
    }, "Amount must be positive"),
    type: z.enum(["INCOME", "EXPENSE"]),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    date: z.string(),
})

type TransactionFormValues = z.infer<typeof formSchema>

interface AddTransactionDialogProps {
    orderId?: string
    categories: { id: string; name: string; type: string }[]
}

export function AddTransactionDialog({ orderId, categories }: AddTransactionDialogProps) {
    const [open, setOpen] = useState(false)

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "", // Default to empty string for clean input
            type: "EXPENSE",
            description: "",
            categoryId: "",
            date: format(new Date(), "yyyy-MM-dd"),
        },
    })

    // Watch type to filter categories
    const selectedType = form.watch("type") as "INCOME" | "EXPENSE"
    const filteredCategories = categories.filter(c => c.type === selectedType)

    async function onSubmit(values: TransactionFormValues) {
        const result = await createTransaction({
            ...values,
            amount: Number(values.amount), // Convert to number for backend
            orderId,
            date: new Date(values.date),
        })

        if (result.success) {
            toast.success("Transaction added")
            setOpen(false)
            form.reset({
                amount: "",
                type: values.type,
                description: "",
                categoryId: "",
                date: format(new Date(), "yyyy-MM-dd"),
            })
        } else {
            toast.error(result.error || "Failed to add transaction")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Transaction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex space-x-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="EXPENSE">Expense</SelectItem>
                                                <SelectItem value="INCOME">Income</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        {/* Use type="number" but let RHF handle value as is (string/number) */}
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            value={field.value as string}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value as string}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filteredCategories.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                            {filteredCategories.length === 0 && <SelectItem value="none" disabled>No categories found</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Details..." {...field} value={field.value as string} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit">Add</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
