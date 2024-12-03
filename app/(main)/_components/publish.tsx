"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { CheckIcon, CopyIcon, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


interface PublishProps {
	initialData: Doc<"documents">,
}

export const Publish = ({
	initialData,
} : PublishProps) => {
	const origin = useOrigin();
	const update = useMutation(api.documents.update);

	const [copied, setCopied] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const url = `${origin}/preview/${initialData._id}`;

	const onPublish = () => {
		setIsSubmitting(true);

		const promise = update({
			id: initialData._id as Id<"documents">,
			isPublished: true,
		})
		.finally(() => setIsSubmitting(false));

		toast.promise(promise, {
			loading: "Publishing Note.",
			success: "Note Published",
			error: "Failed to Publish Note."
		});
	}
	
	const onUnpublish = () => {
		setIsSubmitting(true);

		const promise = update({
			id: initialData._id as Id<"documents">,
			isPublished: false,
		})
		.finally(() => setIsSubmitting(false));

		toast.promise(promise, {
			loading: "Unpublishing Note.",
			success: "Note Unpublished",
			error: "Failed to Unpublish Note."
		});
	}

	const onCopy = () => {
		navigator.clipboard.writeText(url);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 3000)
	}
	
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="sm" variant="ghost" className="bg-transparent hover:bg-black/5 dark:hover:bg-white/5 pr-2">
					Publish
					{initialData.isPublished && (
						<Globe 
							className="text-sky-500 w-4 h-4 ml-0"
						/>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent 
				className="w-72" 
				align="end"
				alignOffset={8}
				forceMount
			>
				{initialData.isPublished ? (
					<div className="space-y-4">
						<div className="flex items-center gap-x-2">
							<Globe className="text-sky-500 animate-pulse h-4 w-4"/>
							<p className="text-xs font-medium text-sky-600 dark:text-sky-500">
								This Note is live on the web.
							</p>
						</div>
						<div className="flex items-center">
							<input 
								value={url} 
								className="flex-1 px-2 text-sm border rounded-l-md h-8 bg-muted truncate"
								disabled
							/>
							<Button
								onClick={onCopy}
								disabled={copied}
								className="h-8 rounded-l-none bg-black hover:bg-black/80 dark:hover:bg-white/95 dark:bg-white/85"
							>
								{copied ? (
									<CheckIcon className="h-4 w-4"/>
								) : (
									<CopyIcon className="h-4 w-4"/>
								)}
							</Button>
						</div>
						<Button
							size="sm"
							className="w-full text-sm"
							disabled={isSubmitting}
							onClick={onUnpublish}
						>
							Unpublish
						</Button>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center">
						<Globe className="h-8 w-8 text-muted-foreground mb-2"/>
						<p className="text-sm font-medium mb-2">
							Publish this Note
						</p>
						<span className="text-xs text-muted-foreground mb-4">
							Share your work with others
						</span>
						<Button
							disabled={isSubmitting}
							onClick={onPublish}
							className="w-full text-xs"
							size="sm"
						>
							Publish
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}