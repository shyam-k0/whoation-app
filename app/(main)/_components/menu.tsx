"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuProps {
	documentId: Id<"documents">,
}

export const Menu = ({
	documentId,
}: MenuProps) => {
	const router = useRouter();
	const {user} = useUser();

	const archive = useMutation(api.documents.archive);

	const onArchive = () => {
		const promise = archive({id: documentId});

		toast.promise(promise, {
			loading: "Moving to Trash",
			success: "Note moved to Trash",
			error: "Failed to archive Note. Try again."
		});

		router.push("/documents");
	}

	return (
		
		<Button 
			size="sm" 
			variant="outline" 
			className="bg-transparent hover:text-red-800 dark:hover:text-[#f29595] text-black dark:text-white border-black  \
			dark:border-white p-1 px-2 font-normal h-auto"
			onClick={onArchive}
		>
			<Trash2 />
			Delete
		</Button>

		// <DropdownMenu>
		// 	<DropdownMenuTrigger asChild>
		// 		<Button size="sm" variant="ghost">
		// 			<MoreHorizontal className="h-4 w-4"/>
		// 		</Button>
		// 	</DropdownMenuTrigger>
		// 	<DropdownMenuContent 
		// 		className="w-60" 
		// 		align="end" 
		// 		alignOffset={8} 
		// 		forceMount
		// 	>
		// 		<DropdownMenuItem onClick={onArchive}>
		// 			<Trash2 className="h-4 w-4 mr-2"/>
		// 			Delete
		// 		</DropdownMenuItem>
		// 	</DropdownMenuContent>
		// </DropdownMenu>
	)
}

Menu.Skeleton = function MenuSkeleton(){
	return (
		<Skeleton className="h-6 w-25"/>
	)
}