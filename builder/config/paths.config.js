import path from "path";

export const destinationDirectory = "./test-build";

export let vendorPaths = {
	output: path.join(destinationDirectory, "/scripts/vendor"),
	manifest: path.join(__dirname, "../manifests/")
};

export let siteSectionPaths = {
	src: "source/site-sections",
	dest: {
		css: path.join(destinationDirectory, "styles"),
		js: path.join(destinationDirectory, "scripts")
	},
	concatConfigFileName: "concat.config.json"
};

export let componentPaths = {
	src: "source/components",
	dest: {
		css: path.join(destinationDirectory, "styles/components"),
		js: path.join(destinationDirectory, "scripts/components")
	}
};
export let containerPaths = {
	src: "source/containers",
	dest: {
		css: path.join(destinationDirectory, "styles/containers"),
		js: path.join(destinationDirectory, "scripts/containers")
	}
};
