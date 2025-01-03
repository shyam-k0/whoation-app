"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, SmileIcon, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { cn } from "@/lib/utils";


interface ToolbarProps {
	initialData: Doc<"documents">,
	preview?: boolean,
}


export const Toolbar = ({
	initialData,
	preview,
} : ToolbarProps) => {
	const inputRef = useRef<ElementRef<"textarea">>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(initialData.title);
	const update = useMutation(api.documents.update);
	const removeIcon = useMutation(api.documents.removeIcon);

	const coverImage = useCoverImage();

	const enableInput = () => {
		if (preview) return;

		setIsEditing(true);

		setTimeout(() => {
			setValue(initialData.title);
			inputRef.current?.focus();
			if (inputRef.current?.value === "Untitled"){
				inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
			} else {
				inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
			}
		}, 0);
	}

	const disableInput = () => {
		setIsEditing(false);
	}

	const onInput = (value: string) => {
		setValue(value);
		update({
			id: initialData._id,
			title: value || "Untitled"
		});
	}

	const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter"){
			event.preventDefault();
			disableInput();
		}
	}

	const onIconSelect = (icon: string) => {
		update({
			id: initialData._id,
			icon,
		});
	}

	const onRemoveIcon = () => {
		removeIcon({
			id: initialData._id,
		});
	}


	return (
		<div 
			className={cn(
				"group relative",
				!preview && "pl-[54px]",
				preview && "pl-[54px]"
			)}
		>
			{!!initialData.icon && !preview && (
				<div className="flex items-center gap-x-2 group/icon pt-6">
					<IconPicker	onChange={onIconSelect}>
						<p className="text-6xl hover:opacity-75 transition">
							{initialData.icon}
						</p>
					</IconPicker>
					<Button 
						className="rounded-full opacity-0 group-hover/icon:opacity-100 transition \
						text-muted-foreground text-xs"
						variant="outline"
						size="icon"
						onClick={onRemoveIcon}
					>
						<X className="h-4 w-4"/>
					</Button>
				</div>
			)}
			{!!initialData.icon && preview && (
				<p className="text-6xl pt-6">
					{initialData.icon}
				</p>
			)}

			<div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
				{!initialData.icon && !preview && (
					<IconPicker asChild onChange={onIconSelect}>
						<Button 
							className="text-muted-foreground text-xs" 
							variant="outline" 
							size="sm"
						>
							<SmileIcon className="h-4 w-4 mr-1"/>
							Add Icon
						</Button>
					</IconPicker>
				)}
				{!initialData.coverImage && !preview && (
					<Button
						onClick={coverImage.onOpen}
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
					>
						<ImageIcon className="h-4 w-4 mr-1"/>
						Add Cover
					</Button>
				)}
			</div>
			{isEditing && !preview ? (
				<TextareaAutosize 
					ref={inputRef}
					onBlur={disableInput}
					onKeyDown={onKeyDown}
					value={value}
					onChange={(e) => onInput(e.target.value)}
					className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] \
					dark:text-[#cfcfcf] resize-none"
				/>
			) : (
				<div
					onClick={enableInput}
					className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
				>
					{initialData.title}
				</div>
			)}
		</div>
	)
}