"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import {api} from "@/convex/_generated/api";
import { toast } from "sonner";

const DocumentsPage = () => {
	const { user } = useUser();
	const create = useMutation(api.documents.create);

	const onCreate = () => {
		const promise = create({title: "Untitled"});

		toast.promise(promise, {
			loading: "Creating new Note...",
			success: "Note Created!",
			error: "Note could not be created. Try again."
		});
	}
	
	return (
		<div className="h-full flex flex-col items-center justify-center space-y-4">
			<Image 
				src="/empty.png"
				height="300"
				width="300"
				alt="Empty"
				className="dark:hidden"
			/>
			<Image 
				src="/empty-dark.png"
				height="300"
				width="300"
				alt="Empty"
				className="hidden dark:block"
			/>
			<h2 className="text-lg font-medium">
				Welcome to your workspace, {(user?.firstName)? user.firstName : user?.username}!
			</h2>
			<Button onClick={onCreate}>
				<PlusCircle className="h-5 w-5 mr-1"/>
				Add New Note
			</Button>
		</div>
	);
}

export default DocumentsPage;