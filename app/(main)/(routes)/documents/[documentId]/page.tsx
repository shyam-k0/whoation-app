"use client";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useMemo } from "react";


// interface DocumentIdPageProps {
// 	params: {
// 		documentId: Id<"documents">
// 	}
// }

const EditorSkeleton = () => (
	<div className="space-y-4 pt-4 pl-8">
		<Skeleton className="h-5 w-[80%]" />
		<Skeleton className="h-5 w-[50%]" />
		<Skeleton className="h-5 w-[70%]" />
  </div>
);

const DocumentIdPage = () => {
	const params = useParams();

	const Editor = useMemo(
		() => 
			dynamic(() => import("@/components/editor"), {
				ssr: false,
				loading: () => <EditorSkeleton />
			}
		), []
	);

	const document = useQuery(api.documents.getById, {
		documentId: params.documentId as Id<"documents">
	});

	const update = useMutation(api.documents.update);

	const onEditorChange = (content: string) => {
		update({
			id: params.documentId as Id<"documents">,
			content,
		});
	}

	if (document === undefined){
		return (
			<div>
				<Cover.Skeleton />
				<div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
					<div className="space-y-4 pl-8 pt-4">
						<Skeleton className="h-14 w-[50%]"/>
						<Skeleton className="h-4 w-[80%]"/>
						<Skeleton className="h-4 w-[40%]"/>
						<Skeleton className="h-4 w-[60%]"/>
					</div>
				</div>
			</div>
		)
	}

	if (document === null){
		return (
			<div>
				Not found.
			</div>
		)
	}

	return (
		<div className="pb-40">
			<Cover url={document.coverImage}/>
			<div className="md:max-w-3xl lg:max-w-4xl mx-auto">
				<Toolbar initialData={document}/>
				<Editor 
					editable={true}
					onChange={onEditorChange}
					initialContent={document.content}
				/>
			</div>
		</div>
	)
}

export default DocumentIdPage;