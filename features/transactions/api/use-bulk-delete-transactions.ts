import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Define the response and request types using InferResponseType and InferRequestType
type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn: async (json) => {
            // Send a POST request to the bulk-delete endpoint
            const response = await client.api.transactions["bulk-delete"]["$post"]({json});
            // Parse the JSON response
            return await response.json();
        },
        onSuccess: () => {
            // Show success toast notification
            toast.success("Transaction deleted");
            // Invalidate queries to refresh transactions and summary data
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            // Show error toast notification
            toast.error("Failed to delete transactions");
        }
    });

    return mutation;
}
