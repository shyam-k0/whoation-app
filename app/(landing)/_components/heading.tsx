"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
	return (
		<div className="max-w-3xl space-y-4">
			<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
				Make Notes of your World. Make life efficient. This is <span
				className="underline decoration-orange-300">Whoation</span>
			</h1>
			<h3 className="text-base sm:text-xl md:text-2xl font-medium">
				Whoation is a productive note taking app, for you.
			</h3>
			<Button>
				Enter Workspace
				<ArrowRight className="h-4 w-4 ml-2"/>
			</Button>
		</div>
	)
}